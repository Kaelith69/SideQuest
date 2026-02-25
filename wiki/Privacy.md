# Privacy & Security

This document describes what data SideQuest collects, how it is stored and used, the security controls in place, and your rights as a user.

---

## 📊 Data Collected

### Account Data

| Data | Where stored | Purpose |
|---|---|---|
| Email address | Firebase Authentication | Login identifier |
| Password (hashed) | Firebase Authentication | Authentication — never stored in plaintext |
| Display name | Firebase Auth + Firestore `/users/{uid}` | Shown on tasks and profile |
| Account creation timestamp | Firestore `/users/{uid}.createdAt` | Internal record-keeping |

### Profile & Activity Data

| Data | Where stored | Purpose |
|---|---|---|
| Wallet balance (₹) | Firestore `/users/{uid}.balance` | Escrow system |
| Tasks posted count | Firestore `/users/{uid}.tasksPosted` | Profile stats |
| Tasks completed count | Firestore `/users/{uid}.tasksCompleted` | Profile stats |
| Rating total and count | Firestore `/users/{uid}.totalRating` + `.ratingCount` | Reputation system |

### Task Data

| Data | Where stored | Visible to |
|---|---|---|
| Task title | Firestore `/tasks/{id}.title` | All authenticated users |
| Task description | Firestore `/tasks/{id}.description` | All authenticated users |
| Task category | Firestore `/tasks/{id}.category` | All authenticated users |
| Reward amount | Firestore `/tasks/{id}.reward` | All authenticated users |
| Task location (lat/lng) | Firestore `/tasks/{id}.location` | All authenticated users |
| Poster name and UID | Firestore `/tasks/{id}.poster` | All authenticated users |
| Assignee name and UID | Firestore `/tasks/{id}.assignee` | All authenticated users |
| Timestamps | Firestore `/tasks/{id}.createdAt` etc. | All authenticated users |

### Location Data

- Your device's GPS coordinates are used **only** to centre the map when you open the app.
- Task posts use your **current map-centre coordinates** as the task location — not a continuous location trace.
- Location coordinates are stored in the task document and visible to all authenticated users on the map.
- The app uses `navigator.geolocation.watchPosition()` during a session to keep the map centred; no location history is recorded.

---

## 🔒 Security Controls

### Authentication

- All users must sign in before accessing any task data.
- Firebase Authentication issues short-lived JWT tokens (1-hour validity) that are automatically refreshed.
- Passwords are never stored in Firestore — only in Firebase Authentication's secure store with bcrypt hashing.

### Firestore Security Rules

Access to the database is controlled by server-enforced security rules:

```javascript
// Users collection
match /users/{userId} {
  allow read:   if request.auth != null;            // Any signed-in user may read profiles
  allow create: if request.auth.uid == userId;       // You may only create your own doc
  allow update: if request.auth.uid == userId;       // You may only update your own doc
  allow delete: if false;                            // Accounts cannot be deleted via client
}

// Tasks collection
match /tasks/{taskId} {
  allow read:   if request.auth != null;             // Any signed-in user may read tasks
  allow create: if request.resource.data.poster.id
                   == request.auth.uid;              // You can only post tasks as yourself
  allow update: if resource.data.poster.id   == request.auth.uid
                || resource.data.assignee.id == request.auth.uid;
                                                     // Only poster or assignee can update
  allow delete: if resource.data.poster.id == request.auth.uid;
                                                     // Only poster can delete
}
```

### Atomic Wallet Transactions

All wallet balance changes (escrow deduct, refund, reward release) use Firestore `runTransaction()`. This means:
- A task post that fails partway through will never leave your wallet debited without a corresponding task document.
- Reward release is conditional: the transaction aborts if the task is not in the expected state.
- No user can directly increment another user's wallet by crafting a Firestore request — all mutations are conditional on task ownership or assignee status.

### XSS Prevention

User-supplied text (task titles, descriptions, display names) is always inserted into the DOM via `element.textContent` or typed DOM property assignments. No user input is ever passed to `innerHTML` or `eval`. This prevents stored cross-site scripting attacks.

### Credential Security

- Firebase configuration (API keys) in `js/firebase-config.js` are restricted by Firestore security rules — a key alone gives no meaningful access.
- In a production deployment with a private repository, the config file should still be treated as sensitive and excluded from version control via `.gitignore`.

---

## 🗑️ Data Retention & Deletion

### Automatic Deletion

- **Open tasks** older than 24 hours are automatically deleted by the client-side snapshot callback when any user loads the map. Associated escrow is refunded.

### Manual Deletion

- **Tasks:** A poster can delete their own open task via the UI. The Firestore document is removed and the reward is refunded.
- **Account data:** User documents in Firestore and Firebase Auth entries can be deleted by an administrator via the Firebase Console. There is currently no in-app account deletion flow.

---

## 🌐 Third-Party Services

| Service | Provider | Data sent | Privacy policy |
|---|---|---|---|
| Firebase Authentication | Google | Email, password hash, IP address | [firebase.google.com/support/privacy](https://firebase.google.com/support/privacy) |
| Cloud Firestore | Google | All app data described above | [firebase.google.com/support/privacy](https://firebase.google.com/support/privacy) |
| MapLibre GL JS | MapLibre (open-source) | Map tile requests (your approximate location as tile coordinates) | [maplibre.org](https://maplibre.org/) |
| OpenStreetMap tile server | MapLibre demo tiles | Tile request URL (reveals map viewport) | [demotiles.maplibre.org](https://demotiles.maplibre.org/) |
| Tailwind CSS CDN | Tailwind / jsDelivr | CDN request log (IP, browser) | [tailwindcss.com/privacy](https://tailwindcss.com/privacy) |

### Notes on Map Tile Requests

The default map style fetches tiles from `https://demotiles.maplibre.org`. The tile server receives the coordinates of your current map viewport (not your precise GPS coordinates). Swap the style URL to a self-hosted tile server to eliminate this data sharing entirely.

---

## 👤 User Rights

As a user of SideQuest (in its default Firebase-backed configuration):

| Right | How to exercise |
|---|---|
| **Access your data** | All your data is visible in the app (profile, tasks, wallet). Administrators can export via Firebase Console. |
| **Correct your data** | Edit your display name in the Profile screen. Task content cannot be edited after posting — delete and repost. |
| **Delete your tasks** | Delete any open task you posted via the task detail screen. |
| **Delete your account** | Contact the project owner or administrator; they can remove your Auth record and Firestore user document. |
| **Export your data** | Firebase Console allows administrators to export Firestore collections as JSON / CSV. |

---

## 🛡️ Security Best Practices for Deployers

If you are running a production instance of SideQuest:

1. **Replace demo Firestore rules** with the rules in `firestore.rules` (already auth-gated and ownership-enforced).
2. **Restrict your Firebase API key** in the Google Cloud Console under *API restrictions* — whitelist only the necessary APIs (Identity Toolkit, Firestore).
3. **Enable App Check** in Firebase to prevent unauthorised apps from using your Firebase project quota.
4. **Set Firestore budget alerts** to detect unexpected usage spikes.
5. **Enable Firebase Auth email verification** for additional account security.
6. **Serve over HTTPS** — required for the Geolocation API in production (non-localhost) environments.
7. **Rotate API keys** if credentials are ever accidentally committed to a public repository.

---

[← Home](Home) | [Contributing →](Contributing)
