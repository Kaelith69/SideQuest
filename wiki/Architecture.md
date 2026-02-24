# Architecture

Deep-dive into SideQuest's system design, module responsibilities, data model, and internal component interactions.

---

## 📐 System Overview

SideQuest is a **zero-build, client-side Single-Page Application (SPA)**. There is no custom backend, no bundler, and no deployment pipeline — just static files served over HTTP.

```
┌──────────────────────────────────────────────────────────────────────┐
│                         BROWSER  (SPA)                               │
│  HTML5 shell  +  Vanilla JS ES Modules  +  Tailwind CSS (CDN)        │
├────────────┬──────────────┬─────────────┬────────────┬───────────────┤
│ index.html │   app.js     │   map.js    │  tasks.js  │   auth.js     │
│ (Shell)    │ (Orchestrat) │ (MapLibre)  │ (Firestore)│ (Firebase     │
│            │              │             │            │  Auth)        │
└────────────┴──────┬───────┴──────┬──────┴────────────┴───────────────┘
                    │    HTTPS / WebSocket              
                    ▼                                   
┌──────────────────────────────────────────────────────────────────────┐
│                        FIREBASE  (Google Cloud)                      │
│  ┌───────────────────────────┐  ┌──────────────────────────────────┐ │
│  │   Firebase Authentication  │  │       Cloud Firestore            │ │
│  │   Email / Password         │  │  /users   /tasks                │ │
│  │   JWT tokens               │  │  onSnapshot (real-time)         │ │
│  │   onAuthStateChanged       │  │  runTransaction (atomic wallet) │ │
│  └───────────────────────────┘  └──────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                    │    HTTPS CDN tiles                 
                    ▼                                   
┌──────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL CDN SERVICES                              │
│  MapLibre GL JS 3.6.2 (unpkg.com)  •  Tailwind CSS (cdn.tailwindcss) │
│  Firebase SDK 10.7.1 (www.gstatic.com)                               │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Design Principles

| Principle | Implementation |
|---|---|
| **Zero build step** | Pure ES Modules, CDN-loaded libraries, open with any static server |
| **Real-time first** | Firestore `onSnapshot` listeners push changes to all clients instantly |
| **Mobile-first** | `svh` viewport units, `env(safe-area-inset-*)`, touch-optimised tap targets |
| **Atomic finances** | All wallet mutations use `runTransaction()` — no orphaned debits |
| **Least privilege** | Firestore rules enforce ownership on every read and write |
| **Self-contained modules** | Each `.js` file has a single bounded responsibility; no circular imports |

---

## 📦 Module Breakdown

### `firebase-config.js` — SDK Initialisation

**Responsibility:** Initialise the Firebase SDK once, export `auth` and `db` singletons used by all other modules.

```
initializeApp(config) → app
getAuth(app)          → auth   (exported)
getFirestore(app)     → db     (exported)
```

Every other module imports `{ auth, db }` from this file — it is the single source of truth for Firebase instances.

---

### `app.js` — Application Orchestrator

**Responsibility:** Boot the application, set up the `onAuthStateChanged` listener, and route between the auth page and the main app.

```
init()
  ├── attach locateBtn click → flyToUserLocation()
  └── onAuthStateChanged(auth, user)
        ├── user exists  → showApp(user)
        │     ├── initMap(user)
        │     ├── listenForTasks()
        │     └── listenToUser(user.uid)
        └── user null    → showAuth()
```

**Key decision:** `app.js` deliberately does not import heavy modules at the top level. `listenForTasks` and `listenToUser` are called only after authentication is confirmed, avoiding unnecessary Firestore connections for unauthenticated users.

---

### `auth.js` — Authentication Handlers

**Responsibility:** Wire DOM forms to Firebase Authentication SDK methods.

| Function | Firebase API | Description |
|---|---|---|
| Login form submit | `signInWithEmailAndPassword` | Authenticate returning user |
| Signup form submit | `createUserWithEmailAndPassword` + `updateProfile` + `setDoc` | Create account, display name, and user Firestore document with ₹500 wallet |
| `logout()` (exported) | `signOut` | Sign out and return to auth page |

**New user initialisation:** On successful signup, a `/users/{uid}` document is created with `{ name, email, balance: 500, createdAt }`. The ₹500 is a demo balance — no real money is involved.

---

### `map.js` — Map & Geolocation

**Responsibility:** Initialise and manage the MapLibre GL JS map instance, user-location tracking, and task marker lifecycle.

```
initMap(user)
  ├── new maplibregl.Map({ container: 'map', style, center, zoom })
  ├── map.on('load') → loadTasksOnMap() + setupFAB()
  └── navigator.geolocation.watchPosition()
        └── updateUserMarker(lat, lng)

addTaskMarker(task)   → new maplibregl.Marker(el).setLngLat().addTo(map)
removeTaskMarker(id)  → markers.get(id).remove()
flyToUserLocation()   → map.flyTo({ center: userCoords })
```

**Marker storage:** All task markers are kept in a `Map<taskId, Marker>` so that when Firestore sends a deletion event, the correct marker is removed in O(1).

**Distance calculation:** Uses the Haversine formula to compute distance between the user's position and a task's `location.{lat, lng}` field. Tasks beyond 0.5 km may be filtered client-side depending on the view.

---

### `tasks.js` — Task CRUD & Escrow Logic

**Responsibility:** The largest module. Handles all task operations, real-time Firestore listener, filter/search state, profile display, and ratings.

#### Real-time listener

```javascript
const q = query(
  collection(db, "tasks"),
  where("status", "==", "open"),
  orderBy("createdAt", "desc")
);
const unsubscribe = onSnapshot(q, snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === "added")   addTaskMarker(change.doc);
    if (change.type === "removed") removeTaskMarker(change.doc.id);
  });
});
```

#### Task lifecycle mutations

| Operation | Firestore call | Side effect |
|---|---|---|
| Create task | `addDoc` inside `runTransaction` | Deduct reward from poster wallet |
| Delete task | `deleteDoc` inside `runTransaction` | Refund reward to poster wallet |
| Claim task | `updateDoc` → `status: "in-progress"`, `claimedBy` | — |
| Mark done | `updateDoc` → `status: "pending-confirmation"` | — |
| Complete + rate | `updateDoc` + wallet `runTransaction` | Credit reward to assignee; update rating average |

#### Auto-cleanup

On each snapshot update, tasks where `createdAt < now - 24h` are deleted via `deleteDoc`. The escrow refund is triggered as part of the deletion transaction.

---

### `ui.js` — Shared UI Utilities

**Responsibility:** Provide reusable, non-blocking UI feedback utilities.

```javascript
showToast(message, type)    // Injects a dismissible toast into #toast-container
showConfirm(title, message) // Returns a Promise<boolean> via a modal dialog
```

All toast text is set via `element.textContent` — never `innerHTML` — to prevent XSS with user-supplied strings.

---

## 🗄️ Data Model

### `/users/{uid}`

```javascript
{
  uid:            "firebase-auth-uid",       // Document ID = Auth UID
  name:           "Jane Doe",
  email:          "jane@example.com",
  balance:        500,                       // Current wallet balance (₹)
  tasksCompleted: 0,
  tasksPosted:    0,
  totalRating:    0,                         // Sum of all received ratings
  ratingCount:    0,                         // Number of ratings received
  createdAt:      Timestamp
}
```

**Average rating** is computed as `totalRating / ratingCount` to avoid storing a denormalised value that could drift.

### `/tasks/{taskId}`

```javascript
{
  id:           "auto-generated-doc-id",     // Document ID
  title:        "Walk my dog",
  description:  "Need someone to walk...",
  category:     "Help",                      // Help | Delivery | Social | Other
  reward:       50,                          // Amount in ₹ (0 for free tasks)
  status:       "open",                      // open | in-progress | pending-confirmation | completed
  location: {
    lat: 19.0760,
    lng: 72.8777
  },
  poster: {
    id:   "user-uid",
    name: "Jane Doe"
  },
  assignee: {
    id:   null,                              // null when open; user-uid when claimed
    name: null
  },
  createdAt:   Timestamp,
  claimedAt:   null,
  completedAt: null,
  escrowHeld:  true,                         // true if reward was deducted on post
  rated:       false                         // true after poster submits rating
}
```

---

## 🔐 Security Architecture

### Authentication Flow

```
User submits credentials
    → Firebase Auth validates
    → JWT token issued (1 h validity, auto-refreshed)
    → Token attached to every Firestore request header
    → Security rules validate request.auth.uid
    → Allow or deny
```

### Firestore Security Rules (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users: any auth'd user may read; only the owner may write
    match /users/{userId} {
      allow read:   if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }

    // Tasks: auth'd users read all; poster creates; poster or assignee updates; poster deletes
    match /tasks/{taskId} {
      allow read:   if request.auth != null;
      allow create: if request.auth != null
                    && request.resource.data.poster.id == request.auth.uid;
      allow update: if request.auth != null
                    && (resource.data.poster.id   == request.auth.uid
                    ||  resource.data.assignee.id == request.auth.uid);
      allow delete: if request.auth != null
                    && resource.data.poster.id == request.auth.uid;
    }
  }
}
```

---

## 🔄 State Management

SideQuest has no global state library. State is managed via:

| State type | Mechanism |
|---|---|
| **Authentication** | Firebase `onAuthStateChanged` — single source of truth |
| **Task list** | Firestore `onSnapshot` — server is the source of truth |
| **User profile** | Firestore `onSnapshot` on `/users/{uid}` |
| **UI state** (active filter, search term, open modal) | Module-level `let` variables in `tasks.js` |
| **Map markers** | `Map<taskId, Marker>` in `map.js` |

---

## 🎨 UI Architecture

### Design System

| Token | Value | Usage |
|---|---|---|
| `primary` | `#007AFF` | Buttons, active states, links |
| `secondary` | `#8E8E93` | Muted text, placeholders |
| `background` | `#F2F2F7` | Page background |
| `card` | `rgba(255,255,255,0.8)` | Glassmorphism cards |

### Responsive Strategy

- **Base (< 768 px):** Full-screen views, bottom-sheet modals, bottom nav bar
- **Desktop (≥ 768 px / `md:` prefix):** Sidebar overlays, centred modals, vertical left nav

### Modal Pattern

1. Modal container has `display: none` initially
2. Opening: remove `hidden`, animate backdrop opacity and content `translateY`
3. Closing: reverse animation, add `hidden`
4. Backdrop click and Cancel button both close the modal

---

## ⚡ Performance Notes

| Concern | Current approach | Future improvement |
|---|---|---|
| Task list size | All open tasks loaded at once | Geohash + `limit()` for proximity queries |
| Marker rendering | All markers rendered on map | Marker clustering for dense areas |
| CDN dependency | MapLibre + Firebase loaded from CDN | Self-host or use import maps |
| No caching | Every page load re-fetches | Service Worker + cache-first strategy |

---

## 🔗 External Dependencies

| Library | Version | Source |
|---|---|---|
| Tailwind CSS | Latest | `https://cdn.tailwindcss.com` |
| MapLibre GL JS | 3.6.2 | `https://unpkg.com/maplibre-gl@3.6.2` |
| Firebase App | 10.7.1 | `https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js` |
| Firebase Auth | 10.7.1 | `https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js` |
| Firebase Firestore | 10.7.1 | `https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js` |
| OpenStreetMap tiles | — | `https://demotiles.maplibre.org/style.json` |

---

[← Home](Home.md) | [Installation →](Installation.md)
