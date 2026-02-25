# Installation Guide

Step-by-step instructions for setting up SideQuest locally and deploying to production.

---

## 📋 Prerequisites

| Requirement | Minimum | Notes |
|---|---|---|
| **Browser** | Chrome 90+, Firefox 90+, Safari 15+ | Must support ES Modules (`type="module"`) |
| **Firebase project** | Any plan (free Spark tier works) | Auth + Firestore must be enabled |
| **Local HTTP server** | Any | `file://` origins block ES modules and geolocation |
| **Firebase CLI** *(optional)* | Latest | Only needed to deploy Firestore rules via CLI |

---

## 1 — Clone the Repository

```bash
git clone https://github.com/Kaelith69/SideQuest.git
cd SideQuest
```

The project has **no `package.json`** and **no dependencies to install**. All libraries are loaded from CDN at runtime.

---

## 2 — Create a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com/) and click **Add project**.
2. Give the project a name (e.g. `sidequest-dev`) and click through the wizard.
3. Once created, go to **Build → Authentication → Get started**.
4. Under **Sign-in method**, enable **Email/Password** and click **Save**.
5. Go to **Build → Firestore Database → Create database**.
6. Select **Production mode** (the security rules in this repo will be deployed in the next step).
7. Choose a region close to your users and click **Done**.

---

## 3 — Add Your Firebase Config

In the Firebase Console, go to **Project Settings (⚙️) → General → Your apps**.

If no web app exists, click **Add app → Web**, register it, then copy the `firebaseConfig` object.

Open `js/firebase-config.js` and fill in the values:

```javascript
// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey:            "AIzaSy...",                   // ← your API key
    authDomain:        "your-project.firebaseapp.com",
    projectId:         "your-project-id",
    storageBucket:     "your-project.firebasestorage.app",
    messagingSenderId: "123456789",
    appId:             "1:123456789:web:abc123"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
```

> ⚠️ **Security:** API keys embedded in client-side code are visible to anyone who views source. This is expected for Firebase web apps — the actual security is enforced by Firestore rules (deployed next). However, if this is a public repository, add `js/firebase-config.js` to `.gitignore` and use a local-only copy.

---

## 4 — Deploy Firestore Security Rules

### Option A — Firebase CLI (recommended)

```bash
# Install CLI (requires Node.js)
npm install -g firebase-tools

# Authenticate
firebase login

# Associate this directory with your Firebase project
firebase use --add    # select your project from the list

# Deploy rules only
firebase deploy --only firestore:rules
```

### Option B — Firebase Console

1. Open Firebase Console → **Firestore Database → Rules**.
2. Copy the contents of `firestore.rules` from this repository.
3. Paste into the Rules editor and click **Publish**.

---

## 5 — Start a Local HTTP Server

Choose any method:

```bash
# Python 3 (no install required on macOS/Linux)
python -m http.server 8000

# Node.js (no global install required)
npx http-server . -p 8000

# Node.js with live-reload
npx browser-sync start --server --files "**/*.html, **/*.js, **/*.css"
```

**VS Code users:** Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, right-click `index.html`, and select **Open with Live Server**.

---

## 6 — Open the App

Navigate to:

```
http://localhost:8000
```

Click **Sign Up**, create an account, and you'll receive a **₹500 demo wallet** immediately — no real money involved.

---

## 🚀 Production Deployment

SideQuest is a static site — it can be deployed anywhere that serves HTML, CSS, and JS files over HTTPS.

### Firebase Hosting (recommended)

```bash
# Install and configure
npm install -g firebase-tools
firebase login
firebase init hosting    # set public directory to "." (current dir), single-page app: yes

# Deploy
firebase deploy --only hosting
```

After deployment, Firebase provides a `https://your-project.web.app` URL.

### Netlify

```bash
# Drag-and-drop the project folder to https://app.netlify.com
# or use the CLI:
npm install -g netlify-cli
netlify deploy --prod --dir .
```

### Vercel

```bash
npm install -g vercel
vercel --prod
```

### Any Static Host (GitHub Pages, Cloudflare Pages, etc.)

Upload all project files. Ensure your host serves files over HTTPS (required for the browser Geolocation API).

---

## 🔧 Local Development Tips

### Using the Firebase Emulator Suite

For offline development and faster iteration:

```bash
# Install emulators
firebase init emulators   # select Auth and Firestore

# Start emulators
firebase emulators:start

# Point the app at emulators by adding this to firebase-config.js:
import { connectAuthEmulator }      from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

connectAuthEmulator(auth, "http://localhost:9099");
connectFirestoreEmulator(db, "localhost", 8080);
```

### Accessing From Another Device on LAN

```bash
# Serve on all interfaces
python -m http.server 8000 --bind 0.0.0.0
# or
npx http-server . -p 8000 -a 0.0.0.0

# Find your LAN IP
ip addr show   # Linux
ipconfig       # Windows
ifconfig       # macOS
```

> ⚠️ The Geolocation API requires either `localhost` or an HTTPS origin. Plain HTTP over LAN IP will silently fail on Chrome 50+.

---

## ✅ Verification Checklist

After completing the setup, verify each item:

- [ ] App loads at `http://localhost:8000` without console errors
- [ ] "Sign Up" creates a new account (check Firebase Console → Authentication)
- [ ] New user profile appears in Firestore `/users/{uid}` with `balance: 500`
- [ ] Map renders with OpenStreetMap tiles
- [ ] Browser prompts for location permission and centres the map
- [ ] Posting a task creates a document in Firestore `/tasks/`
- [ ] Task marker appears on the map
- [ ] Filter chips and search bar work

---

## ❓ Common Setup Issues

| Issue | Cause | Fix |
|---|---|---|
| `CORS error` on `file://` | ES Modules blocked | Use a local HTTP server (step 5) |
| `Firebase: No Firebase App` | Config not loaded | Verify `firebase-config.js` is correct and has no typos |
| `Missing or insufficient permissions` | Firestore rules not deployed | Complete step 4 |
| Map shows blank area | CDN blocked / offline | Check internet connection; try a different DNS |
| Geolocation denied | Permission not granted | Click the lock icon in the browser address bar → Allow location |

See [Troubleshooting](Troubleshooting) for more detailed diagnosis steps.

---

[← Home](Home) | [Usage →](Usage)
