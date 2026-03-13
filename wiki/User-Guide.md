# User Guide

Complete guide for using SideQuest to post tasks, claim tasks, and manage your profile.

## 🎯 Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Exploring the Map](#exploring-the-map)
4. [Posting Tasks](#posting-tasks)
5. [Claiming Tasks](#claiming-tasks)
6. [Managing Your Tasks](#managing-your-tasks)
7. [Profile & Wallet](#profile--wallet)
8. [Ratings & Reputation](#ratings--reputation)

---

## Getting Started

### First Time Setup

1. Open SideQuest in your web browser
2. Allow location permissions when prompted (optional but recommended)
3. Create an account or sign in
4. You're ready to explore!

### The Main Interface

SideQuest has three main views accessible from the bottom navigation:

- **🌍 Explore**: Interactive map showing all available tasks
- **📋 My Tasks**: View tasks you've posted or claimed
- **👤 Profile**: Manage your profile, wallet, and statistics

---

## Authentication

### Creating an Account

1. Click **"New to SideQuest? Sign Up"**
2. Enter your details:
   - **Name**: How you'll appear to other users
   - **Email**: For account recovery and notifications
   - **Password**: Minimum 6 characters
3. Click **"Create Account"**
4. You'll be automatically signed in

### Signing In

1. Enter your email and password
2. Click **"Sign In"**
3. You'll be taken to the map view

### Signing Out

1. Tap the **Profile** tab (👤) in bottom navigation
2. Scroll down and tap **"Log Out"**

---

## Exploring the Map

### Map Controls

The interactive map is your main interface for discovering tasks:

#### 🗺️ Basic Navigation
- **Zoom**: Pinch to zoom on mobile, scroll on desktop
- **Pan**: Drag the map with your finger or mouse
- **Rotate**: Two-finger rotate on mobile

#### 📍 Location Features
- **Blue Marker**: Your current location
- **Colored Pins**: Available tasks in your area
- **Locate Me Button**: Top the button in bottom-right to center on your location

### Viewing Task Markers

Tasks appear as markers on the map, color-coded by category:

- **🟢 Green**: Help tasks
- **🟡 Yellow**: Delivery tasks  
- **🟣 Purple**: Social tasks
- **🔵 Blue**: Other tasks

**To view a task:**
1. Tap any marker on the map
2. The task detail modal will open

### Filtering Tasks

Use the category filters to show only specific task types:

1. Tap filter chips below the search bar:
   - **All**: Show all tasks
   - **Help**: General assistance
   - **Delivery**: Pick-up and drop-off
   - **Social**: Companionship activities
2. The map will update to show only matching tasks

### Searching Tasks

1. Tap the search bar at the top
2. Type keywords (e.g., "grocery", "dog walk")
3. Matching tasks will be highlighted

---

## Posting Tasks

Need help with something? Post a task!

### Creating a Task

1. Tap the **blue + button** (FAB) in the bottom-right
2. Fill in the task details:

#### Title
- Keep it short and descriptive
- Examples: "Walk my dog", "Help move furniture", "Pick up groceries"

#### Category
- **Help**: General assistance tasks
- **Delivery**: Pick-up and deliver items
- **Social**: Companionship, events, activities  
- **Other**: Anything else

#### Reward (Optional)
- Enter amount in Rupees (₹)
- If offering a reward, funds will be held in escrow
- Your current balance is shown below the input
- Leave empty for volunteer/free tasks

#### Description
- Provide details about what you need
- Include any special requirements
- Be clear about timing or location specifics

3. Tap **"Post Task"**

### Task Requirements

✅ **Required:**
- Title (minimum 3 characters)
- Description (minimum 10 characters)
- Valid location (uses your current position)

⚠️ **Important:**
- If offering a reward, you must have sufficient balance
- Rewards are held in escrow until task completion
- Tasks auto-delete after 24 hours

### Task Visibility

Once posted:
- Your task appears on the map immediately
- Other users can view and claim it
- You'll receive notifications when someone claims it

---

## Claiming Tasks

See a task you can help with? Claim it!

### Finding Tasks to Claim

1. Browse the map for nearby tasks
2. Or use filters to find specific categories
3. Tap a marker to view details

### Task Details View

When you tap a task marker, you'll see:

- **Poster's name and avatar**
- **Posted time** (e.g., "2 mins ago")
- **Distance** from your location
- **Reward amount** (if offered)
- **Full description**

### Claiming a Task

1. Read the task details carefully
2. Tap **"I'll do it!"** button
3. Confirm the claim
4. The task is now assigned to you

### After Claiming

- The task moves to your **"Claimed"** tab
- Task poster receives a notification
- Complete the task in real life
- Mark as complete in the app

### Can't Claim Your Own Tasks

You cannot claim tasks that you posted yourself.

---

## Managing Your Tasks

Access your tasks via the **📋 My Tasks** tab in bottom navigation.

### Posted Tasks

Tasks you've created appear in the **"Posted"** tab:

#### Task States
- **🟢 Open**: Waiting for someone to claim
- **🟡 In Progress**: Someone is working on it
- **✅ Completed**: Task finished and paid

#### Managing Posted Tasks

**View Details**: Tap any task to see full information

**Delete Task**: 
1. Open task details
2. Tap **"Delete Task"** (only shown for open tasks)
3. Confirm deletion
4. Escrow funds will be refunded

### Claimed Tasks

Tasks you're working on appear in the **"Claimed"** tab:

#### Task States
- **🟡 In Progress**: Currently assigned to you
- **✅ Completed**: Finished and rated

#### Managing Claimed Tasks

**Complete Task**:
1. After finishing the real-world task
2. Open task in **"Claimed"** tab
3. Tap **"Mark as Complete"**
4. Wait for poster to rate you
5. Reward is released to your wallet

**Cancel Claim** (if needed):
1. Open task details
2. Tap **"Cancel Claim"**
3. Task returns to open state

---

## Profile & Wallet

### Viewing Your Profile

1. Tap **Profile** tab (👤) in bottom navigation
2. View your:
   - Name and email
   - Wallet balance
   - Statistics (completed, posted, rating)

### Editing Your Profile

1. Tap the edit icon (✏️) next to your name
2. Enter new name
3. Tap **"Save"**

### Your Wallet

#### Balance Display
- Shows total available funds
- Displayed in Rupees (₹)
- Updated in real-time

#### How Money Flows

**Earning Money:**
- Complete claimed tasks
- Receive ratings from task posters
- Funds automatically added to wallet

**Spending Money:**
- Post tasks with rewards
- Funds held in escrow until task completion
- Refunded if task is deleted

#### Escrow System

When you post a task with a reward:
1. Amount is deducted from your wallet
2. Held in escrow (safe and locked)
3. Released to claimer when task is completed
4. Refunded to you if task is deleted

#### Adding Funds

*Note: Currently, there's no built-in top-up system. This is planned for future updates. For testing, use Firebase Console to manually update wallet amounts.*

---

## Ratings & Reputation

Build your reputation with the 5-star rating system!

### Receiving Ratings

After completing a task:
1. Task poster rates your performance (1-5 stars)
2. Rating is added to your profile
3. Your average rating updates automatically

### Giving Ratings

After someone completes your task:
1. Open the completed task
2. A rating modal appears
3. Select 1-5 stars
4. Tap **"Confirm & Rate"**
5. Reward is released to the task claimer

### Rating Guidelines

⭐ **1 Star**: Task not completed or major issues  
⭐⭐ **2 Stars**: Completed but poor quality  
⭐⭐⭐ **3 Stars**: Acceptable completion  
⭐⭐⭐⭐ **4 Stars**: Good job, minor issues  
⭐⭐⭐⭐⭐ **5 Stars**: Excellent work!

### Viewing Others' Ratings

When viewing task details:
- Poster's rating badge is shown
- Helps you decide which tasks to claim
- Higher ratings = more trustworthy users

### Your Rating Impacts

- **Reputation**: Build trust in the community
- **Visibility**: Higher-rated users may get priority
- **Future Features**: Potential for unlocks and benefits

---

## Tips for Success

### For Task Posters

✅ **Do:**
- Be specific in descriptions
- Offer fair rewards for effort required
- Respond promptly to claimers
- Rate fairly and honestly

❌ **Don't:**
- Post vague or unclear tasks
- Offer rewards you can't afford
- Delete tasks unnecessarily
- Ghost task claimers

### For Task Claimers

✅ **Do:**
- Only claim tasks you can complete
- Communicate with the poster
- Complete tasks promptly
- Deliver quality work

❌ **Don't:**
- Claim tasks you can't finish
- Accept tasks with unclear requirements
- Abandon claimed tasks
- Rush through work

---

## Common Questions

**Q: How close do I need to be to claim a task?**  
A: There's no distance limit, but use common sense. Claim tasks you can realistically reach.

**Q: What if the task poster doesn't rate me?**  
A: Auto-release and auto-rating systems are planned for future updates.

**Q: Can I edit a task after posting?**  
A: Not currently. You'd need to delete and repost. Task editing is planned for future updates.

**Q: How do I contact the task poster/claimer?**  
A: Direct messaging is planned for future updates. Currently, coordinate through task descriptions or external means.

---

## Getting Help

Need assistance? Check these resources:

- [FAQ](FAQ.md) - Common questions and answers
- [Troubleshooting](Troubleshooting.md) - Fix common issues
- [Report an Issue](https://github.com/Kaelith69/SideQuest/issues) - Bug reports

---

[← Back to Home](Home.md) | [Next: Technical Architecture →](Technical-Architecture.md)
