# API Reference

Complete reference for all JavaScript functions in SideQuest.

## 📚 Table of Contents

- [app.js](#appjs)
- [auth.js](#authjs)
- [map.js](#mapjs)
- [tasks.js](#tasksjs)
- [ui.js](#uijs)
- [firebase-config.js](#firebase-configjs)

---

## app.js

Main application orchestrator.

### `init()`

Initializes the SideQuest application.

**Description**: Entry point that sets up auth listeners, UI event handlers, and initializes the app.

**Parameters**: None

**Returns**: `void`

**Example**:
```javascript
init();
```

**Implementation**:
- Sets up auth state listener
- Displays loading screen
- Routes to auth or app page based on login state
- Initializes map and task listeners when authenticated

---

### `showAuth()`

Displays the authentication page.

**Description**: Hides the app page and shows the login/signup interface.

**Parameters**: None

**Returns**: `void`

**Example**:
```javascript
showAuth();
```

---

### `showApp(user)`

Displays the main application interface.

**Description**: Hides auth page, shows the map and app interface for authenticated users.

**Parameters**:
- `user` (Object): Firebase user object

**Returns**: `void`

**Example**:
```javascript
onAuthStateChanged(auth, (user) => {
  if (user) {
    showApp(user);
  }
});
```

---

## auth.js

Authentication module.

### `initializeAuth()`

Sets up authentication UI and event listeners.

**Description**: Initializes form submissions, toggles, and error displays.

**Parameters**: None

**Returns**: `void`

**Example**:
```javascript
initializeAuth();
```

---

### `handleLogin(email, password)`

Authenticates an existing user.

**Description**: Signs in user with email and password using Firebase Auth.

**Parameters**:
- `email` (string): User's email address
- `password` (string): User's password

**Returns**: `Promise<UserCredential>`

**Throws**: FirebaseError if authentication fails

**Example**:
```javascript
try {
  await handleLogin('user@example.com', 'password123');
  console.log('Login successful');
} catch (error) {
  console.error('Login failed:', error);
}
```

---

### `handleSignup(name, email, password)`

Creates a new user account.

**Description**: Creates a new user with email and password, then updates their profile with display name.

**Parameters**:
- `name` (string): User's display name
- `email` (string): User's email address
- `password` (string): User's password (min 6 characters)

**Returns**: `Promise<void>`

**Throws**: FirebaseError if signup fails

**Example**:
```javascript
try {
  await handleSignup('John Doe', 'john@example.com', 'password123');
  console.log('Account created');
} catch (error) {
  console.error('Signup failed:', error);
}
```

---

### `logout()`

Signs out the current user.

**Description**: Signs out the user and redirects to auth page.

**Parameters**: None

**Returns**: `Promise<void>`

**Example**:
```javascript
await logout();
```

---

### `showError(message)`

Displays an authentication error message.

**Description**: Shows error message to user in auth error element.

**Parameters**:
- `message` (string): Error message to display

**Returns**: `void`

**Example**:
```javascript
showError('Invalid email or password');
```

---

## map.js

Map rendering and interaction module.

### `initMap(user)`

Initializes the MapLibre GL map.

**Description**: Creates map instance, centers on user location (or default), adds controls and user marker.

**Parameters**:
- `user` (Object): Firebase user object

**Returns**: `maplibregl.Map` - Map instance

**Example**:
```javascript
const map = initMap(currentUser);
```

---

### `addUserMarker(lng, lat)`

Adds a marker for the user's current location.

**Description**: Creates a blue marker at user's coordinates.

**Parameters**:
- `lng` (number): Longitude
- `lat` (number): Latitude

**Returns**: `maplibregl.Marker` - User marker instance

**Example**:
```javascript
const marker = addUserMarker(72.8777, 19.0760);
```

---

### `updateUserMarker(lng, lat)`

Updates the user's location marker.

**Description**: Moves existing user marker to new coordinates.

**Parameters**:
- `lng` (number): New longitude
- `lat` (number): New latitude

**Returns**: `void`

**Example**:
```javascript
navigator.geolocation.watchPosition((position) => {
  updateUserMarker(position.coords.longitude, position.coords.latitude);
});
```

---

### `addMarker(task, onClick)`

Adds a task marker to the map.

**Description**: Creates a colored marker for a task with click handler.

**Parameters**:
- `task` (Object): Task data object
  - `id` (string): Task ID
  - `location` (Object): {lat, lng}
  - `category` (string): Task category
  - `title` (string): Task title
- `onClick` (Function): Callback when marker is clicked

**Returns**: `maplibregl.Marker` - Task marker instance

**Example**:
```javascript
addMarker(task, (taskData) => {
  openTaskDetail(taskData);
});
```

---

### `clearMarkers()`

Removes all task markers from the map.

**Description**: Iterates through markers Map and removes each marker.

**Parameters**: None

**Returns**: `void`

**Example**:
```javascript
clearMarkers();
// Then add new markers
```

---

### `calculateDistance(coord1, coord2)`

Calculates distance between two coordinates using Haversine formula.

**Description**: Returns distance in kilometers.

**Parameters**:
- `coord1` (Object): {lat, lng}
- `coord2` (Object): {lat, lng}

**Returns**: `number` - Distance in kilometers

**Example**:
```javascript
const distance = calculateDistance(
  { lat: 19.0760, lng: 72.8777 },
  { lat: 19.0800, lng: 72.8800 }
);
console.log(`${distance.toFixed(2)} km away`);
```

---

### `flyToUserLocation()`

Smoothly animates map to user's current location.

**Description**: Flies to user marker position with animation.

**Parameters**: None

**Returns**: `void`

**Example**:
```javascript
locateButton.addEventListener('click', flyToUserLocation);
```

---

### `getMapCenter()`

Gets the current center coordinates of the map.

**Description**: Returns the map center as {lng, lat}.

**Parameters**: None

**Returns**: `Object` - {lng: number, lat: number}

**Example**:
```javascript
const center = getMapCenter();
console.log(`Map centered at ${center.lat}, ${center.lng}`);
```

---

### `onUserLocationUpdate(callback)`

Sets up geolocation watcher.

**Description**: Watches user location and calls callback on updates.

**Parameters**:
- `callback` (Function): Called with (lng, lat) on location change

**Returns**: `number` - Watch ID for clearing

**Example**:
```javascript
const watchId = onUserLocationUpdate((lng, lat) => {
  updateUserMarker(lng, lat);
});

// Later: navigator.geolocation.clearWatch(watchId);
```

---

## tasks.js

Task management and CRUD operations.

### `initTaskListeners()`

Sets up all task-related UI event listeners.

**Description**: Attaches click handlers for modals, forms, navigation, etc.

**Parameters**: None

**Returns**: `void`

**Example**:
```javascript
initTaskListeners();
```

---

### `openCreateModal()`

Opens the task creation modal.

**Description**: Shows modal with slide-up animation.

**Parameters**: None

**Returns**: `void`

**Example**:
```javascript
fabButton.addEventListener('click', openCreateModal);
```

---

### `closeModals()`

Closes all open modals.

**Description**: Hides and resets all modal elements.

**Parameters**: None

**Returns**: `void`

**Example**:
```javascript
cancelButton.addEventListener('click', closeModals);
```

---

### `createTask(data)`

Creates a new task in Firestore.

**Description**: Validates input, handles escrow if reward offered, creates task document.

**Parameters**:
- `data` (Object): Task data
  - `title` (string): Task title
  - `description` (string): Task description
  - `category` (string): Task category
  - `reward` (number): Reward amount (optional)
  - `location` (Object): {lat, lng}

**Returns**: `Promise<string>` - Created task ID

**Throws**: Error if validation fails or insufficient balance

**Example**:
```javascript
try {
  const taskId = await createTask({
    title: 'Walk my dog',
    description: 'Need help walking my golden retriever',
    category: 'Help',
    reward: 50,
    location: getMapCenter()
  });
  console.log('Task created:', taskId);
} catch (error) {
  showToast(error.message, 'error');
}
```

---

### `listenForTasks()`

Sets up real-time listener for tasks collection.

**Description**: Listens to open tasks and updates map markers.

**Parameters**: None

**Returns**: `Function` - Unsubscribe function

**Example**:
```javascript
const unsubscribe = listenForTasks();
// Later: unsubscribe();
```

---

### `listenToUser(uid)`

Sets up real-time listener for user document.

**Description**: Listens to user profile and wallet updates.

**Parameters**:
- `uid` (string): User ID to listen to

**Returns**: `Function` - Unsubscribe function

**Example**:
```javascript
const unsubscribe = listenToUser(auth.currentUser.uid);
```

---

### `claimTask(taskId, userId)`

Claims an open task for a user.

**Description**: Updates task status to 'in-progress' and assigns to user.

**Parameters**:
- `taskId` (string): Task document ID
- `userId` (string): Claiming user's ID

**Returns**: `Promise<void>`

**Throws**: Error if task is not open or user is the poster

**Example**:
```javascript
try {
  await claimTask('task123', auth.currentUser.uid);
  showToast('Task claimed!', 'success');
} catch (error) {
  showToast(error.message, 'error');
}
```

---

### `completeTask(taskId, rating)`

Marks a task as completed with a rating.

**Description**: Updates task status, transfers reward, updates ratings.

**Parameters**:
- `taskId` (string): Task document ID
- `rating` (number): Rating from 1-5 stars

**Returns**: `Promise<void>`

**Throws**: Error if transaction fails

**Example**:
```javascript
await completeTask('task123', 5);
showToast('Task completed! Payment released.', 'success');
```

---

### `deleteTask(taskId)`

Deletes a task and refunds escrow.

**Description**: Only poster can delete. Refunds reward if held in escrow.

**Parameters**:
- `taskId` (string): Task document ID

**Returns**: `Promise<void>`

**Throws**: Error if user is not poster or task is claimed

**Example**:
```javascript
try {
  await deleteTask('task123');
  showToast('Task deleted', 'success');
} catch (error) {
  showToast('Cannot delete claimed task', 'error');
}
```

---

### `openTaskDetail(task)`

Opens task detail modal with task information.

**Description**: Populates modal with task data and shows it.

**Parameters**:
- `task` (Object): Complete task data object

**Returns**: `void`

**Example**:
```javascript
addMarker(task, (taskData) => {
  openTaskDetail(taskData);
});
```

---

### `handleSnapshot(snapshot)`

Processes Firestore snapshot updates.

**Description**: Updates map markers based on snapshot changes.

**Parameters**:
- `snapshot` (QuerySnapshot): Firestore query snapshot

**Returns**: `void`

**Example**:
```javascript
onSnapshot(tasksQuery, handleSnapshot);
```

---

## ui.js

UI utilities and helper functions.

### `showToast(message, type)`

Displays a toast notification.

**Description**: Shows temporary notification at top of screen.

**Parameters**:
- `message` (string): Message to display
- `type` (string): 'success' | 'error' | 'info' | 'warning'

**Returns**: `void`

**Example**:
```javascript
showToast('Task created successfully!', 'success');
showToast('Something went wrong', 'error');
```

---

### `showConfirm(title, message)`

Shows a confirmation dialog.

**Description**: Displays modal asking user to confirm action.

**Parameters**:
- `title` (string): Dialog title
- `message` (string): Confirmation message

**Returns**: `Promise<boolean>` - true if confirmed, false if cancelled

**Example**:
```javascript
const confirmed = await showConfirm(
  'Delete Task',
  'Are you sure you want to delete this task?'
);

if (confirmed) {
  await deleteTask(taskId);
}
```

---

### `openModal(modalElement)`

Opens a modal with animation.

**Description**: Shows modal with fade-in/slide-up animation.

**Parameters**:
- `modalElement` (HTMLElement): Modal element to open

**Returns**: `void`

**Example**:
```javascript
const modal = document.getElementById('create-modal');
openModal(modal);
```

---

### `closeModal(modalElement)`

Closes a modal with animation.

**Description**: Hides modal with fade-out/slide-down animation.

**Parameters**:
- `modalElement` (HTMLElement): Modal element to close

**Returns**: `void`

**Example**:
```javascript
closeModal(createModal);
```

---

### `formatRelativeTime(timestamp)`

Formats timestamp as relative time.

**Description**: Converts Firestore timestamp to "2 mins ago", "1 hour ago", etc.

**Parameters**:
- `timestamp` (Timestamp): Firestore timestamp

**Returns**: `string` - Formatted relative time

**Example**:
```javascript
const timeAgo = formatRelativeTime(task.createdAt);
// "5 minutes ago"
```

---

### `formatCurrency(amount)`

Formats number as currency.

**Description**: Formats number with rupee symbol and proper decimals.

**Parameters**:
- `amount` (number): Amount in rupees

**Returns**: `string` - Formatted currency string

**Example**:
```javascript
const formatted = formatCurrency(1500);
// "₹1,500"
```

---

## firebase-config.js

Firebase initialization and configuration.

### Exports

#### `auth`

**Type**: `Auth`

**Description**: Firebase Authentication instance

**Usage**:
```javascript
import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'firebase/auth';

await signInWithEmailAndPassword(auth, email, password);
```

---

#### `db`

**Type**: `Firestore`

**Description**: Firestore database instance

**Usage**:
```javascript
import { db } from './firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';

const snapshot = await getDocs(collection(db, 'tasks'));
```

---

## Types Reference

### Task Object

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  category: 'Help' | 'Delivery' | 'Social' | 'Other';
  reward: number;
  escrowHeld: boolean;
  status: 'open' | 'in-progress' | 'completed';
  location: {
    lat: number;
    lng: number;
  };
  postedBy: string;
  postedByName: string;
  claimedBy: string | null;
  claimedByName: string | null;
  rated: boolean;
  rating: number | null;
  createdAt: Timestamp;
  claimedAt: Timestamp | null;
  completedAt: Timestamp | null;
}
```

### User Object

```typescript
interface User {
  uid: string;
  name: string;
  email: string;
  wallet: number;
  tasksCompleted: number;
  tasksPosted: number;
  totalRating: number;
  ratingCount: number;
  createdAt: Timestamp;
  lastActive: Timestamp;
}
```

---

## Error Handling

All async functions should be wrapped in try-catch:

```javascript
try {
  await createTask(taskData);
  showToast('Success!', 'success');
} catch (error) {
  console.error('Error:', error);
  showToast(error.message, 'error');
}
```

---

## Best Practices

1. **Always validate input** before database operations
2. **Use transactions** for wallet operations
3. **Detach listeners** when no longer needed
4. **Handle errors gracefully** with user-friendly messages
5. **Log errors** to console for debugging

---

[← Back to Home](Home.md) | [Next: Troubleshooting →](Troubleshooting.md)
