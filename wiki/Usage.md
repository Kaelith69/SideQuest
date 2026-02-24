# Usage Guide

Complete walkthrough of every feature in SideQuest — from signing up to completing tasks and managing your profile.

---

## 🔐 Authentication

### Sign Up

1. Open the app — you land on the auth screen.
2. Click **"New to SideQuest? Sign Up"** to reveal the sign-up form.
3. Enter your **name**, **email**, and a **password** (minimum 6 characters).
4. Click **Create Account**.

On successful signup:
- Your Firebase Auth account is created.
- A `/users/{uid}` Firestore document is created with a **₹500 demo wallet balance**.
- You are redirected to the main map screen.

### Sign In

1. Enter your **email** and **password** on the login form.
2. Click **Sign In**.

> **Tip:** Firebase Auth persists your session in the browser's local storage. You remain logged in across page refreshes and browser restarts until you explicitly log out.

### Log Out

1. Navigate to the **Profile** tab (bottom navigation).
2. Scroll to the bottom and tap **Log Out**.

---

## 🗺️ The Map Screen

The map screen is your home base. It shows all open tasks as colour-coded map pins overlaid on OpenStreetMap tiles.

### Navigation Bar

| Tab | Icon | Function |
|---|---|---|
| **Explore** | 🌐 Globe | Show the live map |
| **My Tasks** | 📋 Clipboard | See tasks you posted or claimed |
| **Profile** | 👤 Person | View your wallet, stats, and settings |

### Locate Me Button

Tap the **📍 crosshair button** (bottom-right corner) to fly the map back to your current location.

### Map Controls

- **Pinch to zoom** (touch) or **scroll wheel** (desktop)
- **Drag** to pan
- **Two-finger rotate** to rotate (touch)

---

## 📝 Posting a Task

1. Tap the **＋ FAB button** (bottom-right, blue circle with plus sign).
2. Fill in the form:

| Field | Required | Notes |
|---|---|---|
| **Title** | ✅ | Short description, e.g. "Walk my dog for 30 min" |
| **Category** | ✅ | Help / Delivery / Social / Other |
| **Reward (₹)** | ❌ | Optional; must not exceed your wallet balance |
| **Description** | ✅ | Detail what needs to be done |

3. Tap **Post Task**.

**What happens next:**
- If a reward was set, the amount is immediately **deducted from your wallet** (escrowed).
- A new document is created in Firestore `/tasks/` with `status: "open"`.
- A map marker appears at your current location.
- The task is visible to all other signed-in users on the map.

> ⚠️ You **cannot edit** a task after posting. Delete it and repost if you need to make changes.

---

## 🙋 Claiming a Task

1. Tap any task marker on the map (or find a task in search results).
2. A **task detail sheet** slides up showing:
   - Poster's name and avatar
   - Time posted and approximate distance
   - Reward amount
   - Task title and description
3. Tap **"I'll do it!"** to claim the task.

**What happens:**
- Task `status` changes to `"in-progress"`.
- `assignee.id` is set to your user UID.
- The task appears under **My Tasks → Claimed** tab.
- The map marker colour updates to indicate it is in-progress.

> ℹ️ You **cannot claim your own task**. The claim button is hidden for tasks you posted.

---

## ✅ Completing a Task

Once you have finished the work:

1. Go to **My Tasks → Claimed** tab.
2. Find the in-progress task and tap **"Mark as Done"**.
3. Task `status` changes to `"pending-confirmation"`.
4. The task poster receives a notification (toast) prompting them to confirm.

---

## ⭐ Rating & Confirming Completion (Poster)

After the assignee marks a task done, you (as the poster) will see a **rating modal**:

1. Select 1–5 stars to rate the assignee's work.
2. Tap **"Confirm & Rate"**.

**What happens:**
- Task `status` changes to `"completed"`.
- The reward (₹) is **atomically transferred** from escrow to the assignee's wallet.
- The assignee's `totalRating` and `ratingCount` are updated.
- The task marker is removed from the map.

You may also tap **"Skip / Cancel"** to rate 0 stars (the reward is still released). Skipping does not update the rating average.

---

## 🔍 Searching & Filtering Tasks

### Search Bar

The search bar at the top of the map screen performs **client-side full-text matching** against each task's `title` and `description` fields.

- Results update in real-time as you type.
- Matching is **case-insensitive**.
- Search does not filter the map — it filters the task list view only.

### Category Chips

Below the search bar there is a row of filter chips:

| Chip | Shows |
|---|---|
| **All** | All open tasks |
| **Help** | Tasks categorised as Help |
| **Delivery** | Tasks categorised as Delivery |
| **Social** | Tasks categorised as Social |

Tap a chip to activate it. Only one category can be active at a time. Active chip is styled with the primary blue colour.

---

## 🗑️ Deleting a Task (Poster)

You can only delete tasks you posted that are still `open` (not yet claimed).

1. Tap the task marker on the map.
2. In the task detail sheet, tap **"Delete Task"** (visible only to the poster).
3. Confirm the deletion in the prompt.

**What happens:**
- The Firestore document is deleted.
- If a reward was escrowed, it is **refunded to your wallet** atomically.
- The map marker is removed.

> ℹ️ Tasks claimed by another user cannot be deleted while `in-progress`.

---

## 💰 Wallet

Your wallet balance is displayed:
- On the **Profile** screen under your name.
- In the **Create Task** modal next to the reward field.

### Starting Balance

Every new account starts with **₹500** (demo credits — no real money).

### Wallet Changes

| Event | Effect |
|---|---|
| Post task with reward | Balance decremented by reward amount |
| Delete your own task | Balance incremented by reward amount (refund) |
| Complete a task you claimed | Balance incremented by reward amount |

All balance mutations are performed inside Firestore atomic transactions. You cannot post a task with a reward exceeding your balance.

---

## 👤 Profile

Navigate to the **Profile** tab to see:

| Section | Content |
|---|---|
| Avatar | First letter of your display name |
| Display name + email | Your account details |
| Rating badge | Your average star rating (shown if you have been rated) |
| Wallet balance | Current ₹ balance |
| Stats grid | Tasks completed / tasks posted / average rating |
| Log Out button | Sign out of the app |

### Editing Your Display Name

1. Tap the **✏️ pencil icon** next to your name.
2. Enter a new name in the text field.
3. Tap **Save**.

---

## 📋 My Tasks

The **My Tasks** screen has two tabs:

### Posted Tab

Lists all tasks you have posted, grouped by status:
- `open` — awaiting a claimer
- `in-progress` — someone is working on it
- `pending-confirmation` — assignee marked done; awaiting your rating

### Claimed Tab

Lists all tasks you have claimed or are working on:
- `in-progress` — tap **Mark as Done** when finished
- `pending-confirmation` — waiting for the poster to rate and confirm
- `completed` — finished tasks (for reference)

---

## 📱 Mobile-Specific Tips

- **Safe areas:** The UI automatically accounts for iPhone notches and Android navigation bars using `env(safe-area-inset-*)`.
- **Map gestures:** Use two fingers to scroll the page behind the map. Single-finger drags pan the map.
- **Bottom sheets:** Task detail and create modals slide up from the bottom on mobile; centred on desktop.
- **Viewport:** Uses `100svh` (Small Viewport Height) so the layout doesn't shift when the browser address bar hides.

---

## ⌨️ Keyboard Shortcuts (Desktop)

| Shortcut | Action |
|---|---|
| `Esc` | Close any open modal |
| `Enter` in search bar | Confirm search |
| `Tab` | Navigate between form fields |

---

[← Installation](Installation.md) | [Architecture →](Architecture.md)
