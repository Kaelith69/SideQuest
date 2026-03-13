# Security Guide

Essential security practices and guidelines for deploying SideQuest safely.

## ⚠️ Critical Warning

**DO NOT deploy SideQuest to production with default security settings!** The default configuration is insecure and intended only for local development.

---

## 🔒 Firebase Security

### Firestore Security Rules

#### Current Rules (INSECURE - Development Only)

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

**Problems:**
- Anyone can read all data
- Anyone can write/delete any data
- No authentication checks
- No input validation

#### Recommended Production Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    function hasValidTaskData() {
      return request.resource.data.title is string
        && request.resource.data.title.size() >= 3
        && request.resource.data.title.size() <= 100
        && request.resource.data.description is string
        && request.resource.data.description.size() >= 10
        && request.resource.data.description.size() <= 1000
        && request.resource.data.category in ['Help', 'Delivery', 'Social', 'Other']
        && request.resource.data.reward is number
        && request.resource.data.reward >= 0
        && request.resource.data.reward <= 10000;
    }
    
    // Users collection
    match /users/{userId} {
      // Anyone can read user profiles (for task display)
      allow read: if isSignedIn();
      
      // Users can only create their own profile
      allow create: if isSignedIn() && isOwner(userId);
      
      // Users can only update their own profile
      // Prevent wallet manipulation
      allow update: if isOwner(userId)
        && (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['wallet', 'uid', 'email']));
      
      // Users cannot delete their profile
      allow delete: if false;
    }
    
    // Tasks collection
    match /tasks/{taskId} {
      // Anyone signed in can read tasks
      allow read: if isSignedIn();
      
      // Users can create tasks with valid data
      allow create: if isSignedIn()
        && hasValidTaskData()
        && request.resource.data.postedBy == request.auth.uid
        && request.resource.data.status == 'open'
        && request.resource.data.claimedBy == null;
      
      // Task owners can update their open tasks
      // Task claimers can update in-progress tasks
      allow update: if isSignedIn() && (
        // Owner can update/delete open tasks
        (isOwner(resource.data.postedBy) && resource.data.status == 'open')
        // Claimer can mark as complete
        || (isOwner(resource.data.claimedBy) && resource.data.status == 'in-progress')
        // Anyone can claim open tasks
        || (resource.data.status == 'open' 
            && request.resource.data.status == 'in-progress'
            && request.resource.data.claimedBy == request.auth.uid)
      );
      
      // Task owners can delete their open tasks
      allow delete: if isSignedIn()
        && isOwner(resource.data.postedBy)
        && resource.data.status == 'open';
    }
    
    // Transactions collection (audit log)
    match /transactions/{transactionId} {
      // Users can read their own transactions
      allow read: if isSignedIn() && isOwner(resource.data.userId);
      
      // Only server/cloud functions can create transactions
      allow create, update, delete: if false;
    }
  }
}
```

### Deploying Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

### Testing Security Rules

Use Firebase Emulator Suite for local testing:

```bash
# Install emulators
firebase init emulators

# Start emulators
firebase emulators:start

# Update firebase-config.js to use emulator
import { connectFirestoreEmulator } from "firebase/firestore";
connectFirestoreEmulator(db, 'localhost', 8080);
```

---

## 🔐 Authentication Security

### Password Requirements

Enforce strong passwords in your UI:

```javascript
function validatePassword(password) {
    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
        throw new Error('Password must contain uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        throw new Error('Password must contain lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        throw new Error('Password must contain number');
    }
    return true;
}
```

### Email Verification

Enable email verification in Firebase:

```javascript
import { sendEmailVerification } from "firebase/auth";

async function handleSignup(name, email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Send verification email
    await sendEmailVerification(userCredential.user);
    
    showToast('Please verify your email to continue', 'info');
}

// Check verification status
function isEmailVerified() {
    return auth.currentUser && auth.currentUser.emailVerified;
}
```

### Session Management

Configure session persistence:

```javascript
import { 
    browserLocalPersistence, 
    browserSessionPersistence,
    setPersistence 
} from "firebase/auth";

// Keep user signed in across browser sessions
await setPersistence(auth, browserLocalPersistence);

// Or sign out when browser closes
await setPersistence(auth, browserSessionPersistence);
```

---

## 🛡️ Input Validation

### Client-Side Validation

Always validate user input before sending to Firebase:

```javascript
function validateTaskInput(data) {
    const errors = [];
    
    // Title validation
    if (!data.title || typeof data.title !== 'string') {
        errors.push('Title is required');
    } else if (data.title.length < 3) {
        errors.push('Title must be at least 3 characters');
    } else if (data.title.length > 100) {
        errors.push('Title must be less than 100 characters');
    }
    
    // Description validation
    if (!data.description || typeof data.description !== 'string') {
        errors.push('Description is required');
    } else if (data.description.length < 10) {
        errors.push('Description must be at least 10 characters');
    } else if (data.description.length > 1000) {
        errors.push('Description must be less than 1000 characters');
    }
    
    // Category validation
    const validCategories = ['Help', 'Delivery', 'Social', 'Other'];
    if (!validCategories.includes(data.category)) {
        errors.push('Invalid category');
    }
    
    // Reward validation
    if (typeof data.reward !== 'number' || data.reward < 0) {
        errors.push('Reward must be a positive number');
    } else if (data.reward > 10000) {
        errors.push('Reward cannot exceed ₹10,000');
    }
    
    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
    
    return true;
}
```

### Sanitizing Output

Prevent XSS attacks by sanitizing user-generated content:

```javascript
// ✅ Safe: Use textContent
element.textContent = userInput;

// ❌ Dangerous: innerHTML with user input
element.innerHTML = userInput;

// If HTML is needed, sanitize it first
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

---

## 🔑 API Key Security

### Firebase API Keys

**Important**: Firebase API keys are not secret. They identify your Firebase project, not authorize access. Security is handled by Firestore rules.

However, you should still:

1. **Restrict API Keys**: In Google Cloud Console, restrict your API key to specific domains
2. **Use App Check**: Verify requests come from your app, not bots

### Setting Up App Check

```javascript
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Initialize App Check
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('YOUR_RECAPTCHA_SITE_KEY'),
    isTokenAutoRefreshEnabled: true
});
```

### Environment Variables

For sensitive configuration, use environment variables:

```javascript
// .env (never commit this file)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_PROJECT_ID=your-project-id

// firebase-config.js
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    // ...
};
```

---

## 💰 Wallet Security

### Transaction Integrity

Use Firestore transactions for atomic wallet operations:

```javascript
async function createTaskWithEscrow(taskData, userId, rewardAmount) {
    const userRef = doc(db, 'users', userId);
    
    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            
            if (!userDoc.exists()) {
                throw new Error('User not found');
            }
            
            const currentBalance = userDoc.data().wallet || 0;
            
            if (currentBalance < rewardAmount) {
                throw new Error('Insufficient balance');
            }
            
            // Deduct from wallet
            transaction.update(userRef, {
                wallet: currentBalance - rewardAmount
            });
            
            // Create task
            const taskRef = doc(collection(db, 'tasks'));
            transaction.set(taskRef, {
                ...taskData,
                escrowHeld: true,
                reward: rewardAmount
            });
            
            // Log transaction
            const txnRef = doc(collection(db, 'transactions'));
            transaction.set(txnRef, {
                userId,
                type: 'escrow_deduct',
                amount: rewardAmount,
                taskId: taskRef.id,
                timestamp: serverTimestamp()
            });
        });
        
        showToast('Task created and payment held', 'success');
    } catch (error) {
        console.error('Transaction failed:', error);
        showToast('Failed to create task: ' + error.message, 'error');
    }
}
```

### Prevent Double-Spending

Ensure wallet updates are atomic:

```javascript
// ❌ Bad: Race condition possible
const balance = await getBalance(userId);
await updateBalance(userId, balance - amount);

// ✅ Good: Atomic transaction
await runTransaction(db, async (transaction) => {
    const userDoc = await transaction.get(userRef);
    const balance = userDoc.data().wallet;
    transaction.update(userRef, {
        wallet: balance - amount
    });
});
```

---

## 🚫 Rate Limiting

### Client-Side Rate Limiting

Prevent spam by limiting actions:

```javascript
class RateLimiter {
    constructor(maxCalls, windowMs) {
        this.maxCalls = maxCalls;
        this.windowMs = windowMs;
        this.calls = [];
    }
    
    isAllowed() {
        const now = Date.now();
        this.calls = this.calls.filter(time => now - time < this.windowMs);
        
        if (this.calls.length >= this.maxCalls) {
            return false;
        }
        
        this.calls.push(now);
        return true;
    }
}

// Usage: Max 5 task creations per minute
const taskLimiter = new RateLimiter(5, 60000);

async function createTask(data) {
    if (!taskLimiter.isAllowed()) {
        showToast('Too many tasks created. Please wait.', 'error');
        return;
    }
    
    // Proceed with task creation
    // ...
}
```

### Server-Side Rate Limiting

Use Firebase App Check and Cloud Functions:

```javascript
// Cloud Function with rate limiting
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.createTask = functions.https.onCall(async (data, context) => {
    // Verify App Check
    if (context.app == undefined) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'The function must be called from an App Check verified app.'
        );
    }
    
    // Check rate limit (using Firestore or Redis)
    const userId = context.auth.uid;
    const recentTasks = await admin.firestore()
        .collection('tasks')
        .where('postedBy', '==', userId)
        .where('createdAt', '>', Date.now() - 60000)
        .get();
    
    if (recentTasks.size >= 5) {
        throw new functions.https.HttpsError(
            'resource-exhausted',
            'Too many tasks created'
        );
    }
    
    // Create task
    // ...
});
```

---

## 🌐 HTTPS & CORS

### Force HTTPS

Always use HTTPS in production:

```javascript
// Redirect HTTP to HTTPS
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
}
```

### CORS Configuration

Firebase Hosting handles CORS automatically. For custom domains:

```json
// firebase.json
{
  "hosting": {
    "headers": [
      {
        "source": "/api/**",
        "headers": [
          {
            "key": "Access-Control-Allow-Origin",
            "value": "https://your-domain.com"
          }
        ]
      }
    ]
  }
}
```

---

## 🔍 Monitoring & Logging

### Security Audit Logging

Log security-relevant events:

```javascript
async function logSecurityEvent(type, details) {
    await addDoc(collection(db, 'security_logs'), {
        type,
        details,
        userId: auth.currentUser?.uid || 'anonymous',
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        ip: await fetch('https://api.ipify.org?format=json')
            .then(r => r.json())
            .then(d => d.ip)
    });
}

// Usage
logSecurityEvent('failed_login', { email });
logSecurityEvent('wallet_updated', { oldBalance, newBalance });
logSecurityEvent('task_deleted', { taskId });
```

### Firebase Security Rules Monitoring

Enable audit logs in Google Cloud Console:
1. Go to IAM & Admin > Audit Logs
2. Enable "Data Access" logs for Firestore
3. Monitor in Logs Explorer

---

## 🚨 Incident Response

### Handling Security Breaches

If you suspect a security breach:

1. **Immediately disable affected accounts**
   ```bash
   firebase auth:delete USER_UID
   ```

2. **Review audit logs**
   - Check Firestore access patterns
   - Review Cloud Functions logs
   - Check authentication logs

3. **Update security rules**
   - Deploy stricter rules immediately
   - Review and fix vulnerabilities

4. **Notify affected users**
   - Be transparent about the breach
   - Explain steps taken
   - Recommend password changes

5. **Post-mortem**
   - Document what happened
   - Update security practices
   - Implement preventive measures

---

## ✅ Security Checklist

Before deploying to production:

### Firebase
- [ ] Updated Firestore security rules (no wildcards)
- [ ] Enabled Firebase App Check
- [ ] Restricted API keys to specific domains
- [ ] Enabled email verification
- [ ] Configured password requirements
- [ ] Set up audit logging

### Application
- [ ] All user input validated client-side
- [ ] All user input validated server-side (rules)
- [ ] No secrets in client-side code
- [ ] XSS prevention implemented
- [ ] CSRF protection in place
- [ ] Rate limiting implemented
- [ ] HTTPS enforced

### Data
- [ ] User data properly encrypted
- [ ] Wallet transactions are atomic
- [ ] No PII exposed in logs
- [ ] Backup strategy in place

### Monitoring
- [ ] Security logs enabled
- [ ] Alerts configured for suspicious activity
- [ ] Regular security audits scheduled

---

## 📚 Additional Resources

- [Firebase Security Rules Guide](https://firebase.google.com/docs/rules)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [Web Security Best Practices](https://developer.mozilla.org/en-US/docs/Web/Security)

---

[← Back to Home](Home.md) | [Next: Deployment Guide →](Deployment-Guide.md)
