# Database Schema

Complete reference for SideQuest's Firestore database structure.

## 📊 Overview

SideQuest uses Firebase Firestore, a NoSQL document database. The database consists of three main collections:

- **users**: User profiles and wallet data
- **tasks**: Posted tasks and their statuses
- **transactions**: Wallet transaction history (optional)

---

## 👤 Users Collection

**Collection Path**: `/users/{userId}`

Stores user profile information, wallet balance, and statistics.

### Document Structure

```javascript
{
  // Auto-generated document ID (matches Firebase Auth UID)
  uid: string,
  
  // Profile Information
  name: string,
  email: string,
  photoURL: string | null,          // Future: profile picture URL
  bio: string | null,                // Future: user bio
  
  // Wallet & Finances
  wallet: number,                    // Current balance in ₹
  
  // Statistics
  tasksCompleted: number,            // Number of tasks completed
  tasksPosted: number,               // Number of tasks posted
  totalRating: number,               // Sum of all ratings received
  ratingCount: number,               // Number of ratings received
  
  // Timestamps
  createdAt: Timestamp,              // Account creation date
  lastActive: Timestamp,             // Last time user was active
  
  // Settings (Future)
  notificationsEnabled: boolean,
  emailNotifications: boolean,
  locationSharing: boolean
}
```

### Field Details

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `uid` | string | Yes | Auth UID | Firebase Auth user ID |
| `name` | string | Yes | - | User's display name |
| `email` | string | Yes | - | User's email address |
| `photoURL` | string\|null | No | null | Profile picture URL (future) |
| `bio` | string\|null | No | null | User bio (future) |
| `wallet` | number | Yes | 0 | Current wallet balance |
| `tasksCompleted` | number | Yes | 0 | Count of completed tasks |
| `tasksPosted` | number | Yes | 0 | Count of posted tasks |
| `totalRating` | number | Yes | 0 | Sum of all ratings |
| `ratingCount` | number | Yes | 0 | Number of ratings received |
| `createdAt` | Timestamp | Yes | serverTimestamp() | Account creation |
| `lastActive` | Timestamp | Yes | serverTimestamp() | Last activity |

### Computed Fields

These are calculated in the client, not stored:

```javascript
// Average rating (1-5 stars)
averageRating = totalRating / ratingCount || 0

// Display rating (with fallback)
displayRating = ratingCount > 0 ? averageRating.toFixed(1) : 'New'
```

### Example Document

```javascript
{
  uid: "abc123xyz789",
  name: "John Doe",
  email: "john@example.com",
  photoURL: null,
  bio: null,
  wallet: 1500,
  tasksCompleted: 12,
  tasksPosted: 5,
  totalRating: 57.5,
  ratingCount: 12,
  createdAt: Timestamp(2024, 0, 15, 10, 30, 0),
  lastActive: Timestamp(2024, 2, 1, 14, 22, 30),
  notificationsEnabled: true,
  emailNotifications: false,
  locationSharing: true
}

// Computed: averageRating = 57.5 / 12 = 4.79 stars
```

### Indexes Required

```
Single Field Indexes (auto-created):
- uid
- email
- createdAt
- lastActive

Composite Indexes (create if needed):
- tasksCompleted (desc) + createdAt (desc)  // Leaderboard
```

---

## 📋 Tasks Collection

**Collection Path**: `/tasks/{taskId}`

Stores all task information including status, location, and reward details.

### Document Structure

```javascript
{
  // Auto-generated document ID
  id: string,
  
  // Task Content
  title: string,
  description: string,
  category: string,                  // 'Help' | 'Delivery' | 'Social' | 'Other'
  
  // Financial
  reward: number,                    // Reward amount in ₹ (0 for free)
  escrowHeld: boolean,               // If reward was deducted from poster's wallet
  
  // Status
  status: string,                    // 'open' | 'in-progress' | 'completed'
  
  // Location
  location: {
    lat: number,                     // Latitude
    lng: number                      // Longitude
  },
  
  // User References
  postedBy: string,                  // User ID who posted
  postedByName: string,              // Display name of poster
  postedByRating: number | null,     // Poster's rating (future)
  
  claimedBy: string | null,          // User ID who claimed (null if open)
  claimedByName: string | null,      // Display name of claimer
  
  // Ratings
  rated: boolean,                    // If poster has rated the claimer
  rating: number | null,             // Rating given (1-5 stars)
  
  // Timestamps
  createdAt: Timestamp,              // When task was created
  claimedAt: Timestamp | null,       // When task was claimed
  completedAt: Timestamp | null,     // When task was completed
  
  // Additional Fields (Future)
  images: string[],                  // Task images URLs
  tags: string[],                    // Searchable tags
  estimatedDuration: number,         // Minutes
  deadline: Timestamp | null,        // Task deadline
  priority: string                   // 'low' | 'medium' | 'high'
}
```

### Field Details

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | string | Yes | Auto-gen | Firestore document ID |
| `title` | string | Yes | - | Task title (3-100 chars) |
| `description` | string | Yes | - | Task description (10-1000 chars) |
| `category` | string | Yes | - | Task category |
| `reward` | number | Yes | 0 | Reward amount in ₹ |
| `escrowHeld` | boolean | Yes | false | If funds are in escrow |
| `status` | string | Yes | 'open' | Current task status |
| `location.lat` | number | Yes | - | Latitude |
| `location.lng` | number | Yes | - | Longitude |
| `postedBy` | string | Yes | - | Poster's user ID |
| `postedByName` | string | Yes | - | Poster's display name |
| `claimedBy` | string\|null | Yes | null | Claimer's user ID |
| `claimedByName` | string\|null | Yes | null | Claimer's display name |
| `rated` | boolean | Yes | false | If rating was given |
| `rating` | number\|null | Yes | null | Rating value (1-5) |
| `createdAt` | Timestamp | Yes | serverTimestamp() | Creation time |
| `claimedAt` | Timestamp\|null | Yes | null | Claim time |
| `completedAt` | Timestamp\|null | Yes | null | Completion time |

### Status Flow

```
open → in-progress → completed

Deleted ←┘
```

- **open**: Task is available to claim
- **in-progress**: Task has been claimed by someone
- **completed**: Task is finished and rated
- **Deleted**: Removed from database (not a status, actually deleted)

### Example Document

```javascript
{
  id: "task123abc",
  title: "Walk my dog",
  description: "Need someone to walk my golden retriever for 30 minutes in the park. He's friendly and loves treats!",
  category: "Help",
  reward: 50,
  escrowHeld: true,
  status: "in-progress",
  location: {
    lat: 19.0760,
    lng: 72.8777
  },
  postedBy: "user_abc123",
  postedByName: "Alice Smith",
  postedByRating: 4.8,
  claimedBy: "user_xyz789",
  claimedByName: "Bob Johnson",
  rated: false,
  rating: null,
  createdAt: Timestamp(2024, 2, 1, 10, 0, 0),
  claimedAt: Timestamp(2024, 2, 1, 10, 15, 0),
  completedAt: null,
  images: [],
  tags: ["pets", "outdoor", "quick"],
  estimatedDuration: 30,
  deadline: null,
  priority: "medium"
}
```

### Indexes Required

```
Single Field Indexes:
- status
- category
- postedBy
- claimedBy
- createdAt

Composite Indexes (create in Firebase Console):
- status (asc) + createdAt (desc)
- status (asc) + category (asc) + createdAt (desc)
- postedBy (asc) + status (asc) + createdAt (desc)
- claimedBy (asc) + status (asc) + createdAt (desc)
- category (asc) + createdAt (desc)
```

To create composite indexes, go to:
Firebase Console → Firestore → Indexes → Composite

Or let Firebase auto-create them when you get the error message with a direct link.

---

## 💳 Transactions Collection (Optional)

**Collection Path**: `/transactions/{transactionId}`

Tracks all wallet transactions for audit trail and debugging.

### Document Structure

```javascript
{
  // Auto-generated document ID
  id: string,
  
  // User & Task References
  userId: string,                    // User whose wallet changed
  taskId: string | null,             // Related task (if applicable)
  
  // Transaction Details
  type: string,                      // Transaction type (see below)
  amount: number,                    // Amount in ₹ (positive or negative)
  
  // Wallet State
  balanceBefore: number,             // Wallet balance before transaction
  balanceAfter: number,              // Wallet balance after transaction
  
  // Metadata
  description: string,               // Human-readable description
  timestamp: Timestamp,              // When transaction occurred
  
  // Additional (Future)
  status: string,                    // 'pending' | 'completed' | 'failed'
  metadata: object                   // Additional data
}
```

### Transaction Types

| Type | Description | Amount |
|------|-------------|--------|
| `escrow_deduct` | Reward held in escrow when task created | Negative |
| `escrow_refund` | Escrow returned when task deleted | Positive |
| `task_payment` | Payment received for completing task | Positive |
| `manual_credit` | Admin added funds (testing/support) | Positive |
| `manual_debit` | Admin removed funds (correction) | Negative |
| `tip` | Additional tip given by task poster (future) | Positive |
| `withdrawal` | User withdrew funds to bank (future) | Negative |

### Example Document

```javascript
{
  id: "txn_abc123",
  userId: "user_abc123",
  taskId: "task123abc",
  type: "escrow_deduct",
  amount: -50,
  balanceBefore: 1500,
  balanceAfter: 1450,
  description: "Escrow hold for task: Walk my dog",
  timestamp: Timestamp(2024, 2, 1, 10, 0, 0),
  status: "completed",
  metadata: {
    taskTitle: "Walk my dog",
    taskCategory: "Help"
  }
}
```

### Indexes Required

```
Single Field Indexes:
- userId
- timestamp

Composite Indexes:
- userId (asc) + timestamp (desc)
- userId (asc) + type (asc) + timestamp (desc)
```

---

## 🔍 Common Queries

### Fetch User Profile

```javascript
import { doc, getDoc } from "firebase/firestore";

const userRef = doc(db, "users", userId);
const userSnap = await getDoc(userRef);
if (userSnap.exists()) {
  const userData = userSnap.data();
  console.log("User:", userData);
}
```

### Get All Open Tasks

```javascript
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

const q = query(
  collection(db, "tasks"),
  where("status", "==", "open"),
  orderBy("createdAt", "desc")
);

const unsubscribe = onSnapshot(q, (snapshot) => {
  const tasks = [];
  snapshot.forEach((doc) => {
    tasks.push({ id: doc.id, ...doc.data() });
  });
  console.log("Open tasks:", tasks);
});
```

### Get User's Posted Tasks

```javascript
const q = query(
  collection(db, "tasks"),
  where("postedBy", "==", userId),
  orderBy("createdAt", "desc")
);

onSnapshot(q, (snapshot) => {
  // Handle posted tasks
});
```

### Get User's Claimed Tasks

```javascript
const q = query(
  collection(db, "tasks"),
  where("claimedBy", "==", userId),
  orderBy("createdAt", "desc")
);

onSnapshot(q, (snapshot) => {
  // Handle claimed tasks
});
```

### Get Tasks by Category

```javascript
const q = query(
  collection(db, "tasks"),
  where("status", "==", "open"),
  where("category", "==", "Help"),
  orderBy("createdAt", "desc")
);

onSnapshot(q, (snapshot) => {
  // Handle category tasks
});
```

### Get User Transaction History

```javascript
const q = query(
  collection(db, "transactions"),
  where("userId", "==", userId),
  orderBy("timestamp", "desc"),
  limit(20)
);

onSnapshot(q, (snapshot) => {
  // Handle transactions
});
```

---

## 🔒 Security Rules

See [Security Guide](Security-Guide.md) for complete security rules.

Basic rules structure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read all user profiles
    // Users can only write their own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // All authenticated users can read tasks
    // Users can write their own tasks
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null; // Add logic
      allow delete: if request.auth.uid == resource.data.postedBy;
    }
    
    // Only users can read their own transactions
    match /transactions/{transactionId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if false; // Only server can write
    }
  }
}
```

---

## 📈 Database Optimization

### Best Practices

1. **Use Indexes**: Create composite indexes for complex queries
2. **Limit Results**: Use `.limit()` to avoid fetching too much data
3. **Denormalize**: Store user names in tasks to avoid extra reads
4. **Clean Up**: Delete old completed tasks (24h rule)
5. **Pagination**: Implement cursor-based pagination for large lists

### Performance Tips

```javascript
// ✅ Good: Limited query with index
const q = query(
  collection(db, "tasks"),
  where("status", "==", "open"),
  orderBy("createdAt", "desc"),
  limit(50)
);

// ❌ Bad: Fetching everything
const q = collection(db, "tasks");
```

---

## 🛠️ Migrations

If you need to update the schema:

### Adding a New Field

```javascript
// Update all tasks to add priority field
const tasksRef = collection(db, "tasks");
const snapshot = await getDocs(tasksRef);

const batch = writeBatch(db);
snapshot.forEach((doc) => {
  batch.update(doc.ref, { priority: "medium" });
});

await batch.commit();
```

### Renaming a Field

```javascript
// Rename field (read old, write new, delete old)
const batch = writeBatch(db);
snapshot.forEach((doc) => {
  const data = doc.data();
  batch.update(doc.ref, {
    newFieldName: data.oldFieldName,
    oldFieldName: deleteField()
  });
});

await batch.commit();
```

---

[← Back to Home](Home.md) | [Next: Development Guide →](Development-Guide.md)
