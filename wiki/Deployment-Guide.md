# Deployment Guide

Step-by-step guide to deploying SideQuest to production.

## 🎯 Deployment Options

SideQuest can be deployed to various hosting platforms:

1. **Firebase Hosting** (Recommended)
2. **Netlify**
3. **Vercel**
4. **GitHub Pages**
5. **Any static file hosting**

---

## 🔥 Firebase Hosting (Recommended)

Firebase Hosting is the recommended deployment method as it integrates seamlessly with Firebase services.

### Prerequisites

- Firebase project set up
- Firebase CLI installed
- Project tested locally

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Firebase Hosting

```bash
cd /path/to/SideQuest
firebase init hosting
```

Answer the prompts:
- **What do you want to use as your public directory?** `.` (current directory)
- **Configure as a single-page app?** `Yes`
- **Set up automatic builds and deploys with GitHub?** `No` (or `Yes` if you want CI/CD)

### Step 4: Update firebase.json

Ensure your `firebase.json` has proper configuration:

```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      "wiki/**",
      "README.md",
      "FUNCTION_SPEC.md"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

### Step 5: Update Production Firebase Config

Create a production version of `js/firebase-config.js`:

```javascript
// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "YOUR_PRODUCTION_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Step 6: Deploy Security Rules

**IMPORTANT**: Update Firestore security rules before deploying!

See [Security Guide](Security-Guide.md) for production-ready security rules.

```bash
# Deploy security rules
firebase deploy --only firestore:rules
```

### Step 7: Deploy to Firebase Hosting

```bash
# Deploy everything
firebase deploy

# Or deploy only hosting
firebase deploy --only hosting
```

### Step 8: View Your Live Site

```bash
# Open deployed site
firebase open hosting:site
```

Your site will be available at:
- `https://your-project-id.web.app`
- `https://your-project-id.firebaseapp.com`

### Step 9: Set Up Custom Domain (Optional)

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS setup instructions
5. Wait for SSL certificate provisioning (can take up to 24 hours)

---

## 🌐 Netlify Deployment

### Step 1: Prepare for Deployment

```bash
# Create .gitignore if not exists
echo "js/firebase-config.js" >> .gitignore
echo "node_modules/" >> .gitignore
```

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### Step 3: Deploy on Netlify

1. Go to [Netlify](https://www.netlify.com/)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: Leave empty (no build needed)
   - **Publish directory**: `.` (root)
5. Click "Deploy site"

### Step 4: Configure Environment Variables

Since you can't commit `firebase-config.js`, you have two options:

**Option A**: Use environment variables with a build step

Create a `firebase-config.template.js`:
```javascript
const firebaseConfig = {
    apiKey: "{{FIREBASE_API_KEY}}",
    authDomain: "{{FIREBASE_AUTH_DOMAIN}}",
    // ...
};
```

**Option B**: Commit the config (less secure)

For a simple deployment, you can commit the Firebase config file, but be aware that Firebase API keys are public anyway (security is handled by Firestore rules).

### Step 5: Configure Redirects

Create `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## ▲ Vercel Deployment

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Deploy

```bash
cd /path/to/SideQuest
vercel
```

Follow the prompts:
- Set up and deploy? `Yes`
- Which scope? Choose your account
- Link to existing project? `No`
- Project name? `sidequest` (or your preference)
- Directory? `./`

### Step 3: Configure Vercel

Create `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/js/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Step 4: Deploy Production

```bash
vercel --prod
```

---

## 📄 GitHub Pages

### Step 1: Create gh-pages Branch

```bash
git checkout -b gh-pages
```

### Step 2: Commit Firebase Config

For GitHub Pages, you need to commit the Firebase config:

```bash
git add js/firebase-config.js
git commit -m "Add Firebase config for GitHub Pages"
```

### Step 3: Push to GitHub

```bash
git push origin gh-pages
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Settings → Pages
3. Source: Deploy from branch
4. Branch: `gh-pages`, folder: `/ (root)`
5. Save

Your site will be available at:
`https://username.github.io/SideQuest`

### Step 5: Fix Base Path (if needed)

If deployed to a subdirectory, update all absolute paths in `index.html`:

```html
<!-- Change this: -->
<script src="/js/app.js"></script>

<!-- To this: -->
<script src="./js/app.js"></script>
```

---

## 🔒 Pre-Deployment Security Checklist

Before deploying to production, ensure you've completed these security steps:

### Firebase Security

- [ ] Updated Firestore security rules (see [Security Guide](Security-Guide.md))
- [ ] Enabled Firebase App Check
- [ ] Restricted API keys to your domain
- [ ] Enabled email verification
- [ ] Configured password requirements
- [ ] Reviewed and tested security rules

### Application Security

- [ ] All user inputs validated
- [ ] No secrets in client-side code
- [ ] XSS prevention implemented
- [ ] HTTPS enforced
- [ ] Rate limiting in place
- [ ] Error messages don't leak sensitive info

### Testing

- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices
- [ ] Tested all core features
- [ ] Verified real-time updates work
- [ ] Checked map loading
- [ ] Verified authentication flow

---

## 🔄 Continuous Deployment

### GitHub Actions with Firebase

Create `.github/workflows/firebase-hosting.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

### Set Up Secrets

1. Go to repository Settings → Secrets
2. Add `FIREBASE_SERVICE_ACCOUNT`:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate new private key
   - Copy JSON content
   - Paste as secret value

---

## 📊 Post-Deployment

### Monitoring

Set up monitoring for your deployed app:

1. **Firebase Performance Monitoring**
   ```javascript
   import { getPerformance } from "firebase/performance";
   const perf = getPerformance(app);
   ```

2. **Google Analytics** (Optional)
   ```javascript
   import { getAnalytics } from "firebase/analytics";
   const analytics = getAnalytics(app);
   ```

3. **Error Tracking**
   - Set up Sentry or similar service
   - Monitor browser console errors
   - Set up alerts for critical errors

### Testing in Production

After deployment:
- [ ] Test sign up / sign in
- [ ] Create a test task
- [ ] Claim a test task
- [ ] Verify map loads correctly
- [ ] Check mobile responsiveness
- [ ] Test on multiple browsers
- [ ] Verify SSL certificate

### Performance Optimization

- [ ] Enable Firebase Hosting caching
- [ ] Optimize images
- [ ] Minimize JavaScript (if using build tools)
- [ ] Enable compression
- [ ] Consider CDN for assets

---

## 🐛 Rollback Strategy

If something goes wrong:

### Firebase Hosting Rollback

```bash
# List previous deployments
firebase hosting:channel:list

# View deployment history
firebase hosting:channel:open

# Rollback to previous version
firebase hosting:rollback
```

### Git Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or hard reset (destructive)
git reset --hard HEAD~1
git push -f origin main
```

---

## 📈 Scaling Considerations

As your app grows:

1. **Firestore Limits**
   - 1 million free reads/day
   - 20k free writes/day
   - Monitor usage in Firebase Console

2. **Hosting Bandwidth**
   - 10 GB free per month
   - Optimize asset sizes

3. **Consider Upgrade**
   - Switch to Blaze (pay-as-you-go) plan
   - Set budget alerts

4. **Optimize Queries**
   - Add pagination for tasks
   - Implement geoqueries for nearby tasks only
   - Cache frequently accessed data

---

## 🔗 Custom Domain Setup

### Firebase Hosting

1. Go to Firebase Console → Hosting
2. Add custom domain
3. Verify ownership with TXT record
4. Add A records:
   - `@` → IP provided by Firebase
   - `www` → IP provided by Firebase
5. Wait for SSL provisioning (up to 24 hours)

### Netlify

1. Go to Site settings → Domain management
2. Add custom domain
3. Update DNS records at your registrar
4. Wait for DNS propagation

### Vercel

1. Go to project Settings → Domains
2. Add your domain
3. Configure DNS at your registrar
4. Vercel handles SSL automatically

---

## 📚 Additional Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

---

[← Back to Home](Home.md) | [Next: FAQ →](FAQ.md)
