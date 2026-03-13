# Technical Architecture

Deep dive into SideQuest's system design, component structure, and technical implementation.

## 🏗️ Architecture Overview

SideQuest follows a modern, serverless architecture with a clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   HTML/CSS   │  │  JavaScript  │  │   MapLibre   │      │
│  │  (UI/UX)     │  │  (Business)  │  │  (Mapping)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
                      HTTPS / WSS
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                       Backend Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Firebase   │  │  Firestore   │  │   MapLibre   │      │
│  │     Auth     │  │   Database   │  │   Tiles API  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Principles

1. **Real-time First**: Leverage Firestore real-time listeners for live updates
2. **Client-Side Rendering**: Vanilla JavaScript for fast, interactive UI
3. **Mobile-First**: Responsive design optimized for mobile devices
4. **Serverless**: No custom backend; Firebase handles all infrastructure
5. **Progressive Enhancement**: Works on all devices with graceful degradation

---

## 📦 Component Structure

### Frontend Modules

SideQuest is organized into modular JavaScript files:

```
js/
├── firebase-config.js    # Firebase initialization
├── app.js                # Application orchestration
├── auth.js               # Authentication logic
├── map.js                # Map rendering and interaction
├── tasks.js              # Task CRUD operations
└── ui.js                 # UI utilities and modals
```

#### Module Responsibilities

| Module | Purpose | Key Functions |
|--------|---------|---------------|
| `firebase-config.js` | Firebase SDK setup | `initializeApp()`, exports `auth`, `db` |
| `app.js` | App initialization & routing | `init()`, `showAuth()`, `showApp()` |
| `auth.js` | User authentication | `login()`, `signup()`, `logout()` |
| `map.js` | Map rendering & markers | `initMap()`, `addMarker()`, `updateUserMarker()` |
| `tasks.js` | Task management | `createTask()`, `claimTask()`, `listenForTasks()` |
| `ui.js` | UI helpers | `showToast()`, `showConfirm()`, `openModal()` |

---

## 🔄 Data Flow

### Task Creation Flow

```
User Action (FAB Click)
    ↓
Open Create Modal
    ↓
User Fills Form
    ↓
Validate Input
    ↓
Check Wallet Balance (if reward)
    ↓
Create Transaction in Firestore
    ↓
Deduct from Wallet (if reward)
    ↓
Add Task Document
    ↓
Real-time Listener Triggers
    ↓
Update Map with New Marker
    ↓
Show Success Toast
```

### Task Claiming Flow

```
User Taps Marker
    ↓
Open Task Detail Modal
    ↓
User Clicks "I'll do it!"
    ↓
Validate (Not Own Task)
    ↓
Update Task Status → "in-progress"
    ↓
Set claimedBy → User ID
    ↓
Real-time Update Triggers
    ↓
Update Marker Color
    ↓
Move to "Claimed" Tab
    ↓
Show Success Toast
```

### Task Completion & Rating Flow

```
Claimer Marks Complete
    ↓
Open Rating Modal for Poster
    ↓
Poster Selects Stars (1-5)
    ↓
Update Task Status → "completed"
    ↓
Run Transaction:
    ├─ Add Reward to Claimer Wallet
    ├─ Update Claimer's Rating
    └─ Update Task Document
    ↓
Remove Marker from Map
    ↓
Show Completion Toast
```

---

## 🗄️ Database Design

### Firestore Collections

#### `users` Collection

Stores user profile and wallet information:

```javascript
{
  uid: "user-firebase-uid",
  name: "John Doe",
  email: "john@example.com",
  wallet: 500,                    // Current balance in ₹
  tasksCompleted: 12,
  tasksPosted: 5,
  totalRating: 57.5,              // Sum of all ratings
  ratingCount: 12,                // Number of ratings received
  createdAt: Timestamp,
  lastActive: Timestamp
}
```

**Indexes:**
- `uid` (auto-created document ID)

#### `tasks` Collection

Stores all task data:

```javascript
{
  id: "auto-generated-id",
  title: "Walk my dog",
  description: "Need someone to walk my golden retriever...",
  category: "Help",               // Help, Delivery, Social, Other
  reward: 50,                     // Amount in ₹ (0 for free tasks)
  status: "open",                 // open, in-progress, completed
  
  // Location data
  location: {
    lat: 19.0760,
    lng: 72.8777
  },
  
  // User references
  postedBy: "user-uid",
  postedByName: "John Doe",
  claimedBy: null,                // null when open, user-uid when claimed
  claimedByName: null,
  
  // Timestamps
  createdAt: Timestamp,
  claimedAt: null,
  completedAt: null,
  
  // Additional metadata
  escrowHeld: true,               // If reward was deducted
  rated: false                    // If poster has rated the claimer
}
```

**Indexes:**
- `postedBy` - Query user's posted tasks
- `claimedBy` - Query user's claimed tasks
- `status` - Filter by task status
- `createdAt` - Order by creation time
- `category` - Filter by category

**Compound Indexes (create in Firebase Console if needed):**
- `status` + `createdAt` (descending)
- `postedBy` + `status`
- `claimedBy` + `status`

#### `transactions` Collection (Optional)

Tracks wallet transactions for audit trail:

```javascript
{
  id: "auto-generated-id",
  userId: "user-uid",
  type: "escrow_deduct" | "escrow_refund" | "task_payment" | "manual_credit",
  amount: 50,
  taskId: "task-id",              // Reference to related task
  balanceBefore: 500,
  balanceAfter: 450,
  timestamp: Timestamp,
  description: "Escrow hold for task: Walk my dog"
}
```

---

## 🔐 Security Architecture

### Authentication Flow

```
User Submits Credentials
    ↓
Firebase Auth validates
    ↓
JWT Token issued
    ↓
Token stored in browser
    ↓
Token sent with Firestore requests
    ↓
Security Rules validate token
    ↓
Allow/Deny access
```

### Firestore Security Rules

Current (Development) Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 3, 1);
    }
  }
}
```

**⚠️ WARNING**: These rules allow anyone to read/write. For production, implement proper security.

### Recommended Production Rules

See [Security Guide](Security-Guide.md) for complete production-ready security rules.

---

## 🗺️ Map Architecture

### MapLibre GL JS Integration

```javascript
// Initialize map with user location
const map = new maplibregl.Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/style.json',
  center: [lng, lat],
  zoom: 13
});
```

### Marker Management

**User Location Marker:**
- Blue pulsing marker
- Updates in real-time as user moves
- Stored in `userMarker` variable

**Task Markers:**
- Color-coded by category
- Stored in `markers` Map object
- Key: Task ID → Value: Marker instance
- Clickable to open task details

### Distance Calculation

Uses Haversine formula for accurate distance:

```javascript
function calculateDistance(coord1, coord2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
```

---

## 🎨 UI/UX Architecture

### Design System

**Colors:**
- Primary: `#007AFF` (iOS Blue)
- Secondary: `#8E8E93` (Gray)
- Background: `#F2F2F7` (Light Gray)
- Success: Green tones
- Error: Red tones

**Typography:**
- System font stack: `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto`
- Font sizes follow Tailwind CSS scale

### Responsive Breakpoints

```css
/* Mobile-first approach */
/* Base: Mobile (< 768px) */

/* Tablet and Desktop */
@media (min-width: 768px) {
  /* md: prefix in Tailwind */
  /* Sidebar overlays, rounded corners */
}

@media (min-width: 1024px) {
  /* lg: prefix in Tailwind */
  /* Multi-column layouts */
}
```

### Component Patterns

**Modals:**
- Slide up from bottom on mobile
- Centered overlay on desktop
- Backdrop blur for depth
- Smooth animations

**Navigation:**
- Bottom bar on mobile
- Vertical sidebar on desktop
- Active state indicators
- Smooth transitions

**Cards:**
- Glassmorphism effect (blur + transparency)
- Rounded corners (Tailwind: `rounded-2xl`)
- Shadow for depth
- Hover/active states

---

## 🔌 API Integration

### Firebase Authentication API

```javascript
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
```

**Methods Used:**
- `createUserWithEmailAndPassword()` - Sign up
- `signInWithEmailAndPassword()` - Sign in
- `signOut()` - Log out
- `onAuthStateChanged()` - Auth state listener
- `updateProfile()` - Update user name

### Firestore API

```javascript
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  runTransaction
} from "firebase/firestore";
```

**Methods Used:**
- `addDoc()` - Create documents
- `updateDoc()` - Update documents
- `deleteDoc()` - Delete documents
- `onSnapshot()` - Real-time listeners
- `query()` - Build queries
- `runTransaction()` - Atomic operations (for wallet)

### MapLibre Tiles API

Default demo tiles from MapLibre:
- URL: `https://demotiles.maplibre.org/style.json`
- Free and open-source
- Can be replaced with custom tiles

---

## ⚡ Performance Considerations

### Real-time Listener Optimization

```javascript
// Limit real-time updates to visible area
const q = query(
  collection(db, "tasks"),
  where("status", "==", "open"),
  orderBy("createdAt", "desc")
);

// Detach listener when not needed
const unsubscribe = onSnapshot(q, handleSnapshot);
// Later: unsubscribe();
```

### Marker Rendering

- Only render markers for tasks in viewport (future optimization)
- Reuse marker instances when possible
- Clear markers before re-rendering to prevent memory leaks

### Image Optimization

- Use SVG icons where possible
- Lazy load user avatars (future feature)
- Compress images before upload

---

## 🧪 Testing Architecture

### Manual Testing Checklist

See [Development Guide](Development-Guide.md) for testing procedures.

### Automated Testing (Future)

Planned test framework:
- Unit tests: Jest
- E2E tests: Cypress or Playwright
- Firebase Emulator for local testing

---

## 📈 Scalability Considerations

### Current Limitations

- All tasks loaded at once (no pagination)
- No caching strategy
- Client-side filtering only

### Future Improvements

1. **Pagination**: Load tasks in batches
2. **Geo-queries**: Only load nearby tasks using geohashes
3. **Caching**: Service Worker for offline support
4. **CDN**: Host static assets on CDN
5. **Lazy Loading**: Load components as needed

---

## 🔗 External Dependencies

### Frontend Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| Tailwind CSS | Latest (CDN) | Styling framework |
| MapLibre GL JS | 3.6.2 | Map rendering |
| Firebase SDK | 10.7.1 | Backend services |

### CDN Links

```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- MapLibre GL JS -->
<script src="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"></script>
<link href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css" rel="stylesheet" />

<!-- Firebase (ES Modules) -->
<!-- Loaded via import statements in JS files -->
```

---

## 🚀 Future Architecture Plans

1. **Backend Functions**: Cloud Functions for complex operations
2. **Notifications**: Push notifications for task updates
3. **Chat System**: Real-time messaging between users
4. **Payment Gateway**: Integration with Stripe/Razorpay
5. **Admin Dashboard**: Moderate content and users

---

[← Back to Home](Home.md) | [Next: Database Schema →](Database-Schema.md)
