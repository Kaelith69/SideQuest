# Development Guide

A comprehensive guide for developers who want to contribute to SideQuest or understand its codebase.

## 🎯 For Developers

This guide assumes you have:
- Basic knowledge of JavaScript (ES6+)
- Understanding of HTML/CSS
- Familiarity with Git and GitHub
- Experience with Firebase (helpful but not required)

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/SideQuest.git
cd SideQuest

# Add upstream remote
git remote add upstream https://github.com/Kaelith69/SideQuest.git
```

### 2. Set Up Development Environment

Follow the [Installation Guide](Installation-Guide.md) to set up Firebase and run the app locally.

### 3. Create a Feature Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
```

---

## 📁 Project Structure

```
SideQuest/
├── index.html              # Main HTML file
├── firestore.rules         # Firestore security rules
│
├── js/                     # JavaScript modules
│   ├── firebase-config.js  # Firebase initialization (gitignored)
│   ├── app.js              # App initialization & routing
│   ├── auth.js             # Authentication logic
│   ├── map.js              # Map rendering & interaction
│   ├── tasks.js            # Task CRUD operations
│   └── ui.js               # UI utilities
│
├── styles/                 # CSS files
│   ├── main.css            # Custom styles
│   └── tailwind.css        # Tailwind utilities (if extracted)
│
├── wiki/                   # Documentation
│   ├── Home.md
│   ├── User-Guide.md
│   └── ...
│
├── .git/                   # Git repository
├── .gitignore              # Files to ignore in git
├── README.md               # Project overview
├── FUNCTION_SPEC.md        # Function specifications
└── LICENSE                 # MIT License
```

---

## 🔍 Understanding the Codebase

### Core Modules

#### 1. `app.js` - Application Orchestration

**Purpose**: Entry point, handles auth state, view switching

**Key Functions:**
```javascript
init()           // Initialize app, set up listeners
showAuth()       // Display authentication page
showApp(user)    // Display main app with user data
```

**Flow:**
1. Sets up auth state listener
2. Shows loading screen
3. Routes to auth or app page based on login state
4. Initializes map and task listeners when authenticated

#### 2. `auth.js` - Authentication

**Purpose**: User sign up, sign in, sign out

**Key Functions:**
```javascript
initializeAuth()                    // Set up UI listeners
handleLogin(email, password)        // Sign in user
handleSignup(name, email, password) // Create account
logout()                            // Sign out
showError(message)                  // Display errors
```

**Firebase Auth Methods Used:**
- `createUserWithEmailAndPassword()`
- `signInWithEmailAndPassword()`
- `signOut()`
- `updateProfile()` - Set display name

#### 3. `map.js` - Map Management

**Purpose**: Render map, manage markers, handle location

**Key Functions:**
```javascript
initMap(user)                  // Initialize MapLibre map
addUserMarker(lng, lat)        // Add user location marker
updateUserMarker(lng, lat)     // Update user location
addMarker(task, onClick)       // Add task marker
clearMarkers()                 // Remove all markers
calculateDistance(coord1, coord2) // Calculate distance
flyToUserLocation()            // Center map on user
getMapCenter()                 // Get current map center
```

**Marker Storage:**
- `userMarker` - Single marker for user location
- `markers` - Map object (taskId → marker instance)

#### 4. `tasks.js` - Task Management

**Purpose**: CRUD operations for tasks, wallet management

**Key Functions:**
```javascript
initTaskListeners()            // Set up UI event listeners
openCreateModal()              // Show task creation modal
createTask(data)               // Create new task in Firestore
listenForTasks()               // Real-time task updates
listenToUser(uid)              // Real-time user/wallet updates
claimTask(taskId, userId)      // Claim a task
completeTask(taskId)           // Mark task complete
deleteTask(taskId)             // Delete a task
openTaskDetail(task)           // Show task details modal
handleSnapshot(snapshot)       // Process Firestore snapshot
```

**Real-time Listeners:**
- Tasks collection (all open tasks)
- User document (wallet balance, profile)
- User's posted tasks
- User's claimed tasks

#### 5. `ui.js` - UI Utilities

**Purpose**: Reusable UI components (toasts, modals, confirmations)

**Key Functions:**
```javascript
showToast(message, type)       // Show notification toast
showConfirm(title, message)    // Show confirmation dialog
openModal(modalElement)        // Open modal with animation
closeModal(modalElement)       // Close modal with animation
```

---

## 🏗️ Adding New Features

### Example: Adding Task Editing

Let's walk through adding a new feature step-by-step.

#### 1. Update the UI (index.html)

Add an edit button to the task detail modal:

```html
<!-- In task-detail-modal -->
<button id="edit-task-btn" 
        class="hidden w-full py-4 bg-blue-500 text-white...">
    Edit Task
</button>
```

#### 2. Add Event Listener (tasks.js)

```javascript
const editTaskBtn = document.getElementById('edit-task-btn');

editTaskBtn.addEventListener('click', () => {
    const taskId = editTaskBtn.dataset.taskId;
    openEditModal(taskId);
});
```

#### 3. Create Edit Function

```javascript
async function openEditModal(taskId) {
    // Fetch current task data
    const taskDoc = await getDoc(doc(db, 'tasks', taskId));
    const task = taskDoc.data();
    
    // Populate form fields
    document.getElementById('edit-title').value = task.title;
    document.getElementById('edit-desc').value = task.description;
    // ... populate other fields
    
    // Show modal
    openModal(editModal);
}

async function updateTask(taskId, updates) {
    try {
        await updateDoc(doc(db, 'tasks', taskId), {
            ...updates,
            updatedAt: serverTimestamp()
        });
        showToast('Task updated!', 'success');
        closeModal(editModal);
    } catch (error) {
        console.error(error);
        showToast('Failed to update task', 'error');
    }
}
```

#### 4. Test Your Changes

1. Create a task
2. Open task details
3. Click edit button
4. Modify fields
5. Save and verify changes

---

## 🧪 Testing

### Manual Testing Checklist

Before submitting a PR, test these scenarios:

#### Authentication
- [ ] Sign up with new account
- [ ] Sign in with existing account
- [ ] Sign out
- [ ] Invalid email/password handling
- [ ] Password too short error

#### Tasks
- [ ] Create task without reward
- [ ] Create task with reward (sufficient balance)
- [ ] Create task with reward (insufficient balance)
- [ ] View task on map
- [ ] Claim someone else's task
- [ ] Cannot claim own task
- [ ] Delete own task
- [ ] Complete claimed task

#### Map
- [ ] Map loads correctly
- [ ] User location marker appears
- [ ] Task markers appear
- [ ] Clicking marker opens details
- [ ] Locate button centers on user
- [ ] Zoom and pan work smoothly

#### Profile
- [ ] View profile stats
- [ ] Edit profile name
- [ ] View wallet balance
- [ ] Wallet updates after creating task
- [ ] Wallet updates after completing task

#### UI/UX
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] Toasts appear and disappear
- [ ] Modals open/close smoothly
- [ ] Confirmations work correctly

### Browser Testing

Test on multiple browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (if on macOS)
- [ ] Edge

### Device Testing

Test on various devices:
- [ ] Mobile (iPhone/Android)
- [ ] Tablet (iPad/Android tablet)
- [ ] Desktop (Windows/Mac/Linux)

---

## 🐛 Debugging Tips

### Enable Firebase Debug Mode

```javascript
// In firebase-config.js, add:
import { enableIndexedDbPersistence } from "firebase/firestore";

enableIndexedDbPersistence(db)
  .catch((err) => {
    console.error("Persistence error:", err);
  });
```

### Browser DevTools

**Console Tab:**
- Check for JavaScript errors
- View `console.log()` output
- Test functions directly: `createTask({...})`

**Network Tab:**
- Monitor Firebase API calls
- Check for failed requests
- Verify data being sent/received

**Application Tab:**
- View IndexedDB (Firestore cache)
- Check Local Storage
- Inspect Service Workers (if added)

### Common Issues

**Issue: "Permission denied" in Firestore**
- Check security rules
- Verify user is authenticated
- Ensure document structure matches rules

**Issue: Markers not appearing**
- Check if tasks exist in Firestore
- Verify `listenForTasks()` is called
- Check console for errors in `handleSnapshot()`

**Issue: Location not working**
- User must allow location permissions
- Test on HTTPS (required for geolocation)
- Fallback to default location works?

---

## 📝 Code Style Guide

### JavaScript

**Use ES6+ Features:**
```javascript
// ✅ Good
const user = { name, email };
const { uid, displayName } = user;
const tasks = await getTasks();

// ❌ Avoid
var user = { name: name, email: email };
getTasks().then(function(tasks) { ... });
```

**Async/Await Over Promises:**
```javascript
// ✅ Good
async function createTask(data) {
    try {
        const docRef = await addDoc(collection(db, 'tasks'), data);
        return docRef.id;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// ❌ Avoid
function createTask(data) {
    return addDoc(collection(db, 'tasks'), data)
        .then(docRef => docRef.id)
        .catch(error => console.error(error));
}
```

**Naming Conventions:**
- Variables: `camelCase`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Classes: `PascalCase`

### HTML

**Use Semantic HTML:**
```html
<!-- ✅ Good -->
<button class="..." aria-label="Add task">+</button>
<nav>...</nav>
<main>...</main>

<!-- ❌ Avoid -->
<div class="button" onclick="...">+</div>
```

### CSS (Tailwind)

**Follow Tailwind Conventions:**
```html
<!-- ✅ Good -->
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

<!-- ❌ Avoid custom CSS unless necessary -->
<div class="my-custom-class">
```

---

## 🔄 Git Workflow

### Commit Messages

Follow conventional commits format:

```
feat: add task editing functionality
fix: resolve marker rendering issue
docs: update installation guide
style: format code with prettier
refactor: simplify task creation logic
test: add tests for auth module
chore: update dependencies
```

### Before Committing

```bash
# Check what's changed
git status
git diff

# Stage changes
git add .

# Commit with clear message
git commit -m "feat: add task editing"

# Push to your fork
git push origin feature/your-feature-name
```

### Creating a Pull Request

1. Push your feature branch to GitHub
2. Go to the original repository
3. Click "New Pull Request"
4. Select your fork and branch
5. Fill in the PR template:
   - **Title**: Clear, concise description
   - **Description**: What changed, why, any issues
   - **Screenshots**: For UI changes
   - **Testing**: What you tested

### PR Review Process

- Maintainer will review your code
- Address any feedback
- Once approved, PR will be merged
- Delete your feature branch after merge

---

## 🎨 UI/UX Guidelines

### Design Principles

1. **Mobile-First**: Design for mobile, enhance for desktop
2. **Accessibility**: Use semantic HTML, ARIA labels
3. **Performance**: Minimize reflows, optimize animations
4. **Consistency**: Follow existing patterns

### Animation Guidelines

- Use Tailwind transitions: `transition-all duration-300`
- Prefer `transform` over `top/left` for performance
- Keep animations under 300ms for snappy feel

### Color Usage

- Primary: Use for CTAs, active states
- Secondary: Use for non-essential elements
- Success: Green for confirmations
- Error: Red for warnings/errors

---

## 🚀 Performance Best Practices

### Firestore Queries

```javascript
// ✅ Good: Limited, indexed query
const q = query(
    collection(db, 'tasks'),
    where('status', '==', 'open'),
    orderBy('createdAt', 'desc'),
    limit(50)
);

// ❌ Bad: Fetching all documents
const q = collection(db, 'tasks');
```

### Real-time Listeners

```javascript
// ✅ Good: Detach when not needed
const unsubscribe = onSnapshot(q, handleSnapshot);
// Later:
unsubscribe();

// ❌ Bad: Never detaching
onSnapshot(q, handleSnapshot);
```

### DOM Manipulation

```javascript
// ✅ Good: Batch updates
const fragment = document.createDocumentFragment();
tasks.forEach(task => {
    const el = createTaskElement(task);
    fragment.appendChild(el);
});
container.appendChild(fragment);

// ❌ Bad: Multiple reflows
tasks.forEach(task => {
    const el = createTaskElement(task);
    container.appendChild(el);
});
```

---

## 📦 Dependencies

### Adding New Dependencies

1. Consider if it's really needed
2. Check bundle size impact
3. Ensure it's well-maintained
4. Update documentation

### CDN vs NPM

Currently using CDN for simplicity. If migrating to build system:

```bash
npm init -y
npm install firebase maplibre-gl
npm install -D vite tailwindcss
```

---

## 🔐 Security Considerations

### Never Commit Secrets

```bash
# Add to .gitignore
js/firebase-config.js
.env
*.secret
```

### Validate User Input

```javascript
function validateTaskInput(data) {
    if (!data.title || data.title.length < 3) {
        throw new Error('Title too short');
    }
    if (!data.description || data.description.length < 10) {
        throw new Error('Description too short');
    }
    if (data.reward < 0) {
        throw new Error('Invalid reward');
    }
    return true;
}
```

### Sanitize Output

```javascript
// Use textContent instead of innerHTML when displaying user input
element.textContent = userInput;  // ✅ Safe
element.innerHTML = userInput;    // ❌ XSS risk
```

---

## 🤝 Contributing Guidelines

1. **Read the docs**: Understand the architecture first
2. **Check issues**: Look for open issues to work on
3. **Ask questions**: Open an issue if unsure
4. **Small PRs**: Keep changes focused and reviewable
5. **Test thoroughly**: Test on multiple devices/browsers
6. **Update docs**: If adding features, update wiki

### Good First Issues

Look for issues labeled:
- `good first issue`
- `help wanted`
- `documentation`

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [MapLibre GL JS Docs](https://maplibre.org/maplibre-gl-js-docs/api/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)

---

[← Back to Home](Home.md) | [Next: Security Guide →](Security-Guide.md)
