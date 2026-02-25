# Troubleshooting Guide

Systematic diagnosis and solutions for the most common SideQuest issues.

---

## 🩺 Quick Diagnostic Steps

Before diving into specific sections, run through this checklist first:

1. **Hard refresh:** `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. **Open the browser console:** `F12` → **Console** tab — note any red errors
3. **Check the Network tab:** `F12` → **Network** — look for failed requests (red rows)
4. **Try incognito mode:** Rules out browser extensions or cached state
5. **Try a different browser:** Chrome, Firefox, or Safari

---

## 🔴 Installation & Setup Issues

### App fails to load — CORS error on `file://`

**Symptom:**
```
Access to script at 'file:///js/app.js' blocked by CORS policy
```

**Cause:** ES Modules cannot be loaded from a `file://` origin.

**Fix:** Use a local HTTP server:
```bash
python -m http.server 8000          # Python 3
npx http-server . -p 8000           # Node.js
# Or use VS Code Live Server extension
```

---

### Firebase not initialised

**Symptom:**
```
Firebase: No Firebase App '[DEFAULT]' has been created (app/no-app).
```

**Cause:** `js/firebase-config.js` is missing, empty, or contains placeholder values.

**Fix:**
1. Open `js/firebase-config.js`
2. Ensure `apiKey`, `projectId`, `appId`, etc. are filled with real values from your Firebase project
3. Check for typos — a trailing comma or missing quote will silently break JSON-like objects

---

### Missing or insufficient permissions

**Symptom:**
```
FirebaseError: [code=permission-denied]: Missing or insufficient permissions.
```

**Cause:** Firestore security rules have not been deployed, or have expired.

**Fix:**
```bash
firebase deploy --only firestore:rules
```
Or paste `firestore.rules` into the Firebase Console → **Firestore → Rules** and click **Publish**.

---

## 🔑 Authentication Issues

### Can't sign up — email already in use

**Fix:** Use a different email address, or switch to **Sign In** if you already have an account.

### Can't sign up — weak password

**Fix:** Password must be at least 6 characters. Firebase requires this minimum.

### Stuck on loading screen after login

**Possible causes:**
1. Firebase project not configured → check `firebase-config.js`
2. Authentication not enabled in Firebase Console → **Build → Authentication → Sign-in method → Email/Password → Enable**
3. Network request failed → check internet connection and Firebase status at [status.firebase.google.com](https://status.firebase.google.com/)

### Automatically logged out

**Cause:** Session token expired or browser cleared IndexedDB storage.

**Fix:** Firebase Auth persistence is `browserLocalPersistence` by default (survives tab close). If you are being logged out:
- Check that your browser does not clear cookies/storage on exit
- Test in an incognito window to confirm it's not an extension issue

---

## 🗺️ Map Issues

### Map shows blank grey area

**Possible causes:**

| Cause | Check |
|---|---|
| Internet offline | Can you load `https://demotiles.maplibre.org/style.json` in a new tab? |
| MapLibre JS not loaded | `console.log(typeof maplibregl)` — should not be `undefined` |
| JavaScript error before map init | Check Console for errors in `map.js` |

---

### User location not detected / permission denied

**Symptoms:** Map does not centre on your location; no blue pulsing marker.

**Fixes:**

1. **Grant permission:** Click the lock/info icon in the browser address bar → **Location** → **Allow**
2. **HTTPS required:** Geolocation only works on `localhost` or HTTPS — do not test over a LAN IP without HTTPS
3. **Test manually:**
   ```javascript
   // In browser console
   navigator.geolocation.getCurrentPosition(
     pos => console.log('coords:', pos.coords),
     err => console.error('error:', err.code, err.message)
   );
   ```
   Error codes: `1` = PERMISSION_DENIED, `2` = POSITION_UNAVAILABLE, `3` = TIMEOUT

---

### Task markers not appearing

**Checklist:**

- [ ] Are there tasks in Firestore? Check Firebase Console → **Firestore → tasks** collection
- [ ] Do the tasks have `status: "open"`? Completed/claimed tasks do not appear on the map
- [ ] Is the real-time listener active? Check Console for `onSnapshot` errors
- [ ] Zoom out — markers may be outside the current viewport
- [ ] Check that tasks have a valid `location.lat` and `location.lng`

---

## 💰 Wallet & Task Issues

### Insufficient balance when posting

**Fix:** Either reduce the reward amount or set it to `0`. Your current balance is shown next to the reward input field.

### Can't claim a task

| Error message | Cause | Fix |
|---|---|---|
| No claim button visible | You are the poster of this task | Find a different task to claim |
| Claim button unresponsive | Firestore permission error | Check console; ensure you are signed in |
| Task disappears after claim | Normal — check **My Tasks → Claimed** tab | — |

### Wallet balance not updating after task completion

**Diagnosis steps:**

1. Check Firestore Console: navigate to `users/{your-uid}` — has the `balance` field updated?
2. Check browser console for transaction errors
3. Check that the task status is `"completed"` in Firestore

**If the Firestore value is correct but the UI hasn't updated:** The `onSnapshot` listener on your user document should update the UI automatically. Hard-refresh the page.

### Task stuck in `in-progress`

If a task needs to be manually resolved (e.g. an assignee abandoned it), an administrator can update the Firestore document directly:

```javascript
// Firebase Console → Firestore → tasks → {taskId}
// Change status field to "open" and clear assignee fields
```

---

## 🔒 Firestore Rule Errors

### `permission-denied` on task create

**Cause:** The `poster.id` field in the task document does not match `request.auth.uid`.

**Check:** In `tasks.js`, when calling `addDoc`, ensure the task object contains:
```javascript
poster: {
  id:   auth.currentUser.uid,   // Must match the authenticated user
  name: auth.currentUser.displayName
}
```

### `permission-denied` on task update

**Cause:** Neither `poster.id` nor `assignee.id` in the existing document matches your UID.

---

## 🌐 Network & Firebase Errors

### `FirebaseError: [code=unavailable]` — network request failed

**Checklist:**
1. Check internet connection
2. Check [Firebase Status Dashboard](https://status.firebase.google.com/)
3. Check if a firewall or VPN is blocking `*.firebaseio.com` or `*.googleapis.com`
4. Try disabling browser extensions (ad blockers sometimes block Firebase)

### `FirebaseError: [code=resource-exhausted]` — quota exceeded

**Cause:** Your Firebase project has exceeded the free-tier daily limits:
- Reads: 50,000/day
- Writes: 20,000/day
- Deletes: 20,000/day

**Fix:**
1. Add `.limit(50)` to Firestore queries to reduce read volume
2. Consider upgrading to the Blaze (pay-as-you-go) plan with budget alerts
3. Check Firebase Console → **Usage** to identify which collection is being over-read

---

## 🖥️ Browser-Specific Issues

| Browser | Issue | Fix |
|---|---|---|
| **Chrome** | Service Worker caching stale JS | DevTools → Application → Storage → Clear site data |
| **Firefox** | ES modules not loading | Ensure all `<script>` tags have `type="module"` |
| **Safari** | Map tiles not loading | Safari → Settings → Websites → Cross-website tracking → Allow for site |
| **Safari** | Geolocation denied | Safari → Settings → Websites → Location → Allow |
| **Mobile Chrome** | Bottom nav behind device bar | Safe-area insets are already applied via CSS — try refreshing |

---

## 🔧 Debugging Tools

### Browser DevTools

| Tab | What to check |
|---|---|
| **Console** | JavaScript errors, Firebase SDK messages |
| **Network** | Failed requests to Firestore (`/google.firestore.v1.Firestore`) |
| **Application** | IndexedDB (Firebase Auth tokens), Local Storage, Service Workers |

### Firebase Emulator Suite

For isolated local testing without touching production data:

```bash
firebase emulators:start --only auth,firestore
# UI available at http://localhost:4000
```

Add to `firebase-config.js` when using emulators:
```javascript
import { connectAuthEmulator }      from "...firebase-auth.js";
import { connectFirestoreEmulator } from "...firebase-firestore.js";

connectAuthEmulator(auth, "http://localhost:9099");
connectFirestoreEmulator(db, "localhost", 8080);
```

### Firestore Rules Playground

In Firebase Console → **Firestore → Rules → Rules Playground**, you can simulate read/write operations as a specific user to verify your security rules.

---

## 📞 Getting More Help

If your issue is not listed here:

1. **Search existing issues:** [github.com/Kaelith69/SideQuest/issues](https://github.com/Kaelith69/SideQuest/issues)
2. **Open a new issue** with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behaviour
   - Browser, OS, device type
   - Full console error message (copy-paste, not screenshot if possible)

---

[← Home](Home) | [Roadmap →](Roadmap)

