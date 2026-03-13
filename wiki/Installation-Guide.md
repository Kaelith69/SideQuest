# Installation Guide

This guide will walk you through setting up SideQuest on your local machine for development or testing.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge (not Internet Explorer)
- **Text Editor**: VS Code, Sublime Text, or any code editor
- **Local Web Server**: Python, Node.js, or any HTTP server

### For Backend (Firebase)
- **Firebase Account**: Free tier is sufficient
- **Firebase Project**: Create one at [Firebase Console](https://console.firebase.google.com/)

## 🔧 Installation Steps

### 1. Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/Kaelith69/SideQuest.git

# Or via SSH
git clone git@github.com:Kaelith69/SideQuest.git

# Navigate to project directory
cd SideQuest
```

*Hacker voice: "I'm in."* 🕶️

### 2. Set Up Firebase

#### 2.1 Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter a project name (e.g., "sidequest-dev")
4. Follow the setup wizard (you can disable Google Analytics for development)

#### 2.2 Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. Save changes

#### 2.3 Create Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click **"Create database"**
3. Choose **"Start in test mode"** for development
4. Select a location close to your users
5. Click **"Enable"**

#### 2.4 Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click **"Add app"** → **Web** (</> icon)
4. Register your app (give it a nickname)
5. Copy the Firebase configuration object

### 3. Configure the Application

#### 3.1 Create Firebase Config File

Create a new file at `js/firebase-config.js`:

```bash
touch js/firebase-config.js
```

#### 3.2 Add Firebase Configuration

Open `js/firebase-config.js` and paste the following, replacing with your actual Firebase credentials:

```javascript
// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

⚠️ **Important**: 
- Never commit `firebase-config.js` to a public repository
- Add it to `.gitignore` if you're sharing your code
- Use environment variables for production deployments

### 4. Update Firestore Security Rules

Replace the content of `firestore.rules` with appropriate security rules (see [Security Guide](Security-Guide.md) for production rules):

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Development rules - Update before production!
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 12, 31);
    }
  }
}
```

Deploy the rules:
```bash
firebase deploy --only firestore:rules
```

## 🚀 Running the Application

You cannot simply open `index.html` directly due to CORS restrictions. You need to run a local web server.

### Option 1: Python (Recommended for Quick Testing)

If you have Python installed:

```bash
# Python 3.x
python -m http.server 8000

# Python 2.x (if you're living in the past)
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

### Option 2: Node.js (http-server)

If you have Node.js and npm installed:

```bash
# Install http-server globally (one-time)
npm install -g http-server

# Run the server
http-server . -p 8000
```

Then open: `http://localhost:8000`

### Option 3: Node.js (live-server with auto-reload)

For development with automatic reloading:

```bash
# Install live-server globally (one-time)
npm install -g live-server

# Run with auto-reload
live-server --port=8000
```

### Option 4: VS Code Live Server Extension

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select **"Open with Live Server"**

### Option 5: PHP Built-in Server

If you have PHP installed:

```bash
php -S localhost:8000
```

## ✅ Verify Installation

1. Open `http://localhost:8000` in your browser
2. You should see the SideQuest loading screen
3. The authentication page should appear
4. Try creating a test account

### Test Account Creation

1. Click **"New to SideQuest? Sign Up"**
2. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Click **"Create Account"**
4. You should be redirected to the map view

### Grant Location Permissions

When prompted, allow location access:
- This enables the map to center on your location
- You can still use the app without location access

## 🐛 Troubleshooting Installation

### Issue: "Cannot read properties of undefined"

**Solution**: Make sure `firebase-config.js` exists and has valid credentials.

### Issue: "CORS error" or "Module not found"

**Solution**: You must use a local web server, not open `index.html` directly.

### Issue: Authentication not working

**Solution**: 
1. Check that Email/Password auth is enabled in Firebase Console
2. Verify your Firebase configuration is correct
3. Check browser console for specific error messages

### Issue: Map not loading

**Solution**: 
1. Allow location permissions when prompted
2. Check internet connection (MapLibre loads from CDN)
3. Check browser console for errors

### Issue: Firestore permission denied

**Solution**: 
1. Verify Firestore is created and rules are deployed
2. Check that the rules allow read/write access
3. Make sure you're authenticated

## 🔍 Verifying Components

Check that all components are working:

```bash
# Check if Firebase is configured
# Open browser console and type:
firebase.auth().currentUser
```

### Directory Structure After Setup

```
SideQuest/
├── index.html
├── firestore.rules
├── js/
│   ├── firebase-config.js    # ← You created this
│   ├── app.js
│   ├── auth.js
│   ├── map.js
│   ├── tasks.js
│   └── ui.js
├── styles/
│   ├── main.css
│   └── tailwind.css
├── wiki/                      # Documentation
├── README.md
└── LICENSE
```

## 🎉 Next Steps

Congratulations! You've successfully installed SideQuest.

Now you can:
- [Read the User Guide](User-Guide.md) to learn how to use the app
- [Check the Development Guide](Development-Guide.md) to start contributing
- [Explore the Technical Architecture](Technical-Architecture.md) to understand how it works

## 📞 Need Help?

- Check [Troubleshooting Guide](Troubleshooting.md)
- Read the [FAQ](FAQ.md)
- [Open an issue](https://github.com/Kaelith69/SideQuest/issues) on GitHub

---

[← Back to Home](Home.md) | [Next: Quick Start →](Quick-Start.md)
