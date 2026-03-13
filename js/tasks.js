// js/tasks.js
import { db, auth } from './firebase-config.js';
import {
    collection,
    updateDoc,
    doc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
    runTransaction,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { addMarker, getMapCenter, calculateDistance, clearMarkers, onUserLocationUpdate } from './map.js';
import { showToast, showConfirm } from './ui.js';

// Modals
const createModal = document.getElementById('create-modal');
const detailModal = document.getElementById('task-detail-modal');
const ratingModal = document.getElementById('rating-modal');
const editProfileModal = document.getElementById('edit-profile-modal');

// Buttons & Forms
const fab = document.getElementById('fab-add-task');
const closeModalBtns = document.querySelectorAll('#create-modal-backdrop, #detail-modal-backdrop, #rating-modal-backdrop, #edit-profile-backdrop, #cancel-create, #cancel-rating-btn, #cancel-edit-profile');
const createTaskForm = document.getElementById('create-task-form');
const submitRatingBtn = document.getElementById('submit-rating-btn');
const editProfileBtn = document.getElementById('edit-profile-btn');
const saveProfileBtn = document.getElementById('save-profile-btn');

// Elements for Filters & Search
const filterContainer = document.getElementById('filter-container');
const searchInput = document.getElementById('search-input');

// Elements for Views
const myTasksPage = document.getElementById('my-tasks-page');
const profilePage = document.getElementById('profile-page');
const appPageMap = document.getElementById('app-page-map');

// Navigation
const navExplore = document.getElementById('nav-explore');
const navMyTasks = document.getElementById('nav-mytasks');
const navProfile = document.getElementById('nav-profile');

const myTasksList = document.getElementById('my-tasks-list');
const tabPosted = document.getElementById('tab-posted');
const tabClaimed = document.getElementById('tab-claimed');

// State
let allTasks = [];
let currentUserLocation = null;
let currentCategoryFilter = 'all';
let currentSearchQuery = '';
let myTasksTab = 'posted';
let currentRatingTask = null; // Task being rated
let currentRatingValue = 0;

const TASK_LIMITS = {
    titleMin: 3,
    titleMax: 100,
    descMin: 5,
    descMax: 1000,
    rewardMin: 0,
    rewardMax: 100000,
    categories: new Set(['Help', 'Delivery', 'Social', 'Other'])
};

function getFirestoreErrorMessage(error, fallbackMessage) {
    if (!error) return fallbackMessage;

    if (error.code === 'permission-denied') {
        return `${fallbackMessage}. Please refresh and ensure task data matches required limits.`;
    }

    if (error.code === 'unavailable') {
        return 'Network unavailable. Please check your connection and retry.';
    }

    if (error.code === 'failed-precondition') {
        return 'Operation blocked by data state. Refresh and try again.';
    }

    return `${fallbackMessage}: ${error.message || 'Unknown error'}`;
}

function validateTaskInput({ title, description, category, rewardAmount, userBalance }) {
    if (title.length < TASK_LIMITS.titleMin || title.length > TASK_LIMITS.titleMax) {
        return `Title must be ${TASK_LIMITS.titleMin}-${TASK_LIMITS.titleMax} characters.`;
    }

    if (description.length < TASK_LIMITS.descMin || description.length > TASK_LIMITS.descMax) {
        return `Description must be ${TASK_LIMITS.descMin}-${TASK_LIMITS.descMax} characters.`;
    }

    if (!TASK_LIMITS.categories.has(category)) {
        return 'Please select a valid category.';
    }

    if (!Number.isFinite(rewardAmount)) {
        return 'Reward amount is invalid.';
    }

    if (rewardAmount < TASK_LIMITS.rewardMin || rewardAmount > TASK_LIMITS.rewardMax) {
        return `Reward must be between ₹${TASK_LIMITS.rewardMin} and ₹${TASK_LIMITS.rewardMax}.`;
    }

    if (userBalance < rewardAmount) {
        return `Insufficient funds. You have ₹${userBalance.toFixed(2)}.`;
    }

    return null;
}

function pseudoTimestampNow() {
    return {
        toDate: () => new Date()
    };
}

function upsertTaskInState(task) {
    const index = allTasks.findIndex((t) => t.id === task.id);
    if (index === -1) {
        allTasks.unshift(task);
    } else {
        allTasks[index] = { ...allTasks[index], ...task };
    }
}

function patchTaskInState(taskId, patch) {
    allTasks = allTasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t));
}

function removeTaskFromState(taskId) {
    allTasks = allTasks.filter((t) => t.id !== taskId);
}

function refreshDerivedViews() {
    updateMarkers();

    if (!myTasksPage.classList.contains('hidden')) {
        renderMyTasks();
    }

    if (!profilePage.classList.contains('hidden')) {
        renderProfile();
    }
}

// Subscribe to location updates
onUserLocationUpdate((loc) => {
    currentUserLocation = loc;
    updateMarkers();
});

let userUnsubscribe = null;
let tasksUnsubscribe = null;

export function stopTaskRealtimeListeners() {
    if (userUnsubscribe) {
        userUnsubscribe();
        userUnsubscribe = null;
    }

    if (tasksUnsubscribe) {
        tasksUnsubscribe();
        tasksUnsubscribe = null;
    }

    allTasks = [];
    clearMarkers();
}

export function listenToUser(userId) {
    if (userUnsubscribe) userUnsubscribe();

    userUnsubscribe = onSnapshot(doc(db, "users", userId), async (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.data();
            const balance = Number(data.balance);
            const user = auth.currentUser;

            // Self-heal: only fix balance if it's corrupt. Never touch email/createdAt
            // on an existing doc — those fields are not allowed by validSelfUserUpdate.
            if (Number.isNaN(balance) && user && user.uid === userId) {
                await updateDoc(doc(db, "users", userId), {
                    balance: 0
                });
            }

            const safeBalance = Number.isFinite(balance) ? balance : 0;

            // Update Profile UI
            const balanceEl = document.getElementById('profile-wallet-balance');
            if (balanceEl) balanceEl.textContent = `₹${safeBalance.toFixed(2)}`;

            // Update Create Modal UI
            const createBalanceEl = document.getElementById('create-task-balance');
            if (createBalanceEl) createBalanceEl.textContent = `₹${safeBalance.toFixed(2)}`;

            return;
        }

        const user = auth.currentUser;
        if (!user || user.uid !== userId) return;

        // Doc does not exist at all — create it via validUserCreate path.
        // Must include ALL required fields with correct types.
        await setDoc(doc(db, "users", userId), {
            email: user.email || "",
            name: user.displayName || "User",
            balance: 500,
            createdAt: serverTimestamp()
        });
    }, (error) => {
        console.error("User listener error:", error);
    });
}

// UI Logic
if (fab) {
    fab.addEventListener('click', () => {
        // Update balance in modal
        const user = auth.currentUser;
        if (user) {
            getDoc(doc(db, "users", user.uid)).then(snap => {
                if (snap.exists()) {
                    document.getElementById('create-task-balance').textContent = `₹${snap.data().balance}`;
                }
            });
        }

        createModal.classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('create-modal-backdrop').classList.remove('opacity-0');
            document.getElementById('create-modal-content').classList.remove('translate-y-full');
        }, 10);
    });
}

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        closeModals();
    });
});

function closeModals() {
    // Create Modal
    document.getElementById('create-modal-backdrop').classList.add('opacity-0');
    document.getElementById('create-modal-content').classList.add('translate-y-full');

    // Detail Modal
    const detailBackdrop = document.getElementById('detail-modal-backdrop');
    const detailContent = document.getElementById('detail-modal-content');
    if (detailBackdrop) detailBackdrop.classList.add('opacity-0');

    // Rating Modal
    const ratingBackdrop = document.getElementById('rating-modal-backdrop');
    if (ratingBackdrop) ratingBackdrop.classList.add('opacity-0');

    // Edit Profile Modal
    const editBackdrop = document.getElementById('edit-profile-backdrop');
    if (editBackdrop) editBackdrop.classList.add('opacity-0');

    setTimeout(() => {
        createModal.classList.add('hidden');
        if (detailModal) detailModal.classList.add('hidden');
        if (detailContent) detailContent.classList.add('translate-y-full');
        if (ratingModal) ratingModal.classList.add('hidden');
        if (editProfileModal) editProfileModal.classList.add('hidden');
    }, 300);
}

// Edit Profile Logic
if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
        const user = auth.currentUser;
        if (!user) return;
        document.getElementById('edit-name-input').value = user.displayName || "";

        editProfileModal.classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('edit-profile-backdrop').classList.remove('opacity-0');
        }, 10);
    });
}

if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', async () => {
        const newName = document.getElementById('edit-name-input').value.trim();
        const user = auth.currentUser;
        if (!user || !newName) return;

        saveProfileBtn.textContent = "Saving...";
        saveProfileBtn.disabled = true;

        try {
            await updateProfile(user, { displayName: newName });
            await setDoc(doc(db, "users", user.uid), { name: newName }, { merge: true });

            // Update UI
            document.getElementById('profile-name').textContent = newName;

            // Re-render to ensure consistency
            renderProfile();

            closeModals();
        } catch (e) {
            console.error(e);
            showToast("Failed to update profile: " + e.message, 'error');
        } finally {
            saveProfileBtn.textContent = "Save";
            saveProfileBtn.disabled = false;
        }
    });
}

// Rating Modal Logic
const starContainer = document.getElementById('star-container');
if (starContainer) {
    const stars = starContainer.querySelectorAll('.star-btn');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            currentRatingValue = parseInt(star.getAttribute('data-value'));
            updateStarsUI(currentRatingValue);
            if (submitRatingBtn) submitRatingBtn.disabled = false;
        });
    });
}

function updateStarsUI(val) {
    if (!starContainer) return;

    const stars = starContainer.querySelectorAll('.star-btn');
    stars.forEach(s => {
        const v = parseInt(s.getAttribute('data-value'));
        if (v <= val) {
            s.classList.remove('text-gray-300');
            s.classList.add('text-yellow-400');
        } else {
            s.classList.add('text-gray-300');
            s.classList.remove('text-yellow-400');
        }
    });
    // Color the submit button
    if (submitRatingBtn) {
        submitRatingBtn.classList.remove('bg-gray-200', 'text-gray-400');
        submitRatingBtn.classList.add('bg-primary', 'text-white');
    }
}

if (submitRatingBtn) {
    submitRatingBtn.addEventListener('click', async () => {
        if (!currentRatingTask || currentRatingValue === 0) return;

        submitRatingBtn.textContent = "Submitting...";
        submitRatingBtn.disabled = true;

        try {
            await runTransaction(db, async (transaction) => {
                const taskRef = doc(db, "tasks", currentRatingTask.id);
                const taskSnap = await transaction.get(taskRef);
                if (!taskSnap.exists()) throw new Error("Task not found");

                const taskData = taskSnap.data();
                if (taskData.status !== 'pending-confirmation') {
                    throw new Error("Task is not ready for confirmation");
                }

                // Credit Assignee
                const assigneeId = taskData.assignee?.id;
                if (!assigneeId) throw new Error("Assignee not found for this task");

                const assigneeRef = doc(db, "users", assigneeId);
                const assigneeSnap = await transaction.get(assigneeRef);

                if (assigneeSnap.exists()) {
                    const currentBal = Number(assigneeSnap.data().balance || 0);
                    const reward = Number(taskData.reward?.amount || 0);
                    transaction.update(assigneeRef, {
                        balance: currentBal + reward,
                        lastPayoutTaskId: currentRatingTask.id
                    });
                } else {
                    const reward = Number(taskData.reward?.amount || 0);
                    transaction.set(assigneeRef, {
                        name: taskData.assignee?.name || "User",
                        email: "",
                        balance: reward,
                        lastPayoutTaskId: currentRatingTask.id,
                        createdAt: serverTimestamp()
                    });
                }

                transaction.update(taskRef, {
                    status: "completed",
                    rating: currentRatingValue,
                    completedAt: serverTimestamp()
                });
            });

            patchTaskInState(currentRatingTask.id, {
                status: 'completed',
                rating: currentRatingValue,
                completedAt: pseudoTimestampNow()
            });
            refreshDerivedViews();

            showToast("Thanks for rating!", 'success');
            closeModals();
        } catch (e) {
            console.error(e);
            showToast(`Error submitting rating: ${e.message}`, 'error');
        } finally {
            submitRatingBtn.textContent = "Confirm & Rate";
            submitRatingBtn.disabled = false;
        }
    });
}

// Filters
if (filterContainer) {
    const buttons = filterContainer.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => {
                b.classList.remove('active', 'bg-primary', 'text-white');
                b.classList.add('bg-white/80', 'text-gray-700');
            });
            btn.classList.add('active', 'bg-primary', 'text-white');
            btn.classList.remove('bg-white/80', 'text-gray-700');

            currentCategoryFilter = btn.getAttribute('data-filter');
            updateMarkers();
        });
    });
}

// Search
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        currentSearchQuery = String(e.target?.value || '').toLowerCase().trim();
        updateMarkers();
    });
}

// Navigation
if (navExplore && navMyTasks && navProfile) {
    navExplore.addEventListener('click', () => {
        switchView('explore');
    });
    navMyTasks.addEventListener('click', () => {
        switchView('mytasks');
    });
    navProfile.addEventListener('click', () => {
        switchView('profile');
    });
}

function switchView(view) {
    // Reset all navs
    navExplore.classList.remove('active', 'text-primary');
    navExplore.classList.add('text-gray-400');
    navMyTasks.classList.remove('active', 'text-primary');
    navMyTasks.classList.add('text-gray-400');
    navProfile.classList.remove('active', 'text-primary');
    navProfile.classList.add('text-gray-400');

    // Hide all pages
    appPageMap.classList.add('hidden');
    myTasksPage.classList.add('hidden');
    profilePage.classList.add('hidden');

    if (view === 'explore') {
        appPageMap.classList.remove('hidden');
        navExplore.classList.add('active', 'text-primary');
        navExplore.classList.remove('text-gray-400');
    } else if (view === 'mytasks') {
        myTasksPage.classList.remove('hidden');
        navMyTasks.classList.add('active', 'text-primary');
        navMyTasks.classList.remove('text-gray-400');
        renderMyTasks();
    } else if (view === 'profile') {
        profilePage.classList.remove('hidden');
        navProfile.classList.add('active', 'text-primary');
        navProfile.classList.remove('text-gray-400');
        renderProfile();
    }
}

async function renderProfile() {
    const user = auth.currentUser;
    if (!user) return;

    // Update Basic Info
    const avatarLetter = (user.email || "?")[0].toUpperCase();
    const avatarEl = document.getElementById('profile-avatar-text');
    if (avatarEl) avatarEl.textContent = avatarLetter;

    document.getElementById('profile-name').textContent = user.displayName || "User";
    document.getElementById('profile-email').textContent = user.email;

    // Calculate Stats
    let postedCount = 0;
    let completedCount = 0;
    let totalRating = 0;
    let ratingCount = 0;

    allTasks.forEach(task => {
        // Posted Count
        if (task.poster.id === user.uid) {
            postedCount++;
        }
        // Completed Count & Rating (As Assignee context usually, or general reputation?)
        // Let's count tasks I completed for others
        if (task.assignee?.id === user.uid && task.status === 'completed') {
            completedCount++;
            if (task.rating) {
                totalRating += task.rating;
                ratingCount++;
            }
        }
    });

    const avgRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : "0.0";

    document.getElementById('stat-posted').textContent = postedCount;
    document.getElementById('stat-completed').textContent = completedCount;
    document.getElementById('stat-rating').textContent = avgRating;

    // Verify User Doc & Balance
    const userDocRef = doc(db, "users", user.uid);
    let userBalance = 0;

    // Show Loading Skeleton
    const balanceEl = document.getElementById('profile-wallet-balance');
    if (balanceEl) balanceEl.innerHTML = '<div class="skeleton h-6 w-20 inline-block"></div>';

    try {
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
            userBalance = userSnapshot.data().balance || 0;
        } else {
            // Initialize for existing users (Demo)
            userBalance = 0;
            // Optional: Create doc if missing? For now just read 0.
        }
    } catch (e) {
        console.error("Error fetching balance:", e);
    }

    if (balanceEl) balanceEl.textContent = `₹${userBalance.toFixed(2)}`;

    // Update badge on profile page
    const badge = document.getElementById('profile-rating-badge');
    if (badge) {
        if (ratingCount > 0) {
            badge.textContent = `${avgRating}★`;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}

// My Tasks Tabs
if (tabPosted && tabClaimed) {
    tabPosted.addEventListener('click', () => {
        myTasksTab = 'posted';
        updateMyTasksTabs();
        renderMyTasks();
    });
    tabClaimed.addEventListener('click', () => {
        myTasksTab = 'claimed';
        updateMyTasksTabs();
        renderMyTasks();
    });
}

function updateMyTasksTabs() {
    if (myTasksTab === 'posted') {
        tabPosted.classList.add('bg-white', 'text-primary', 'border-primary');
        tabPosted.classList.remove('bg-white/50', 'text-gray-500', 'border-transparent');

        tabClaimed.classList.remove('bg-white', 'text-primary', 'border-primary');
        tabClaimed.classList.add('bg-white/50', 'text-gray-500', 'border-transparent');
    } else {
        tabClaimed.classList.add('bg-white', 'text-primary', 'border-primary');
        tabClaimed.classList.remove('bg-white/50', 'text-gray-500', 'border-transparent');

        tabPosted.classList.remove('bg-white', 'text-primary', 'border-primary');
        tabPosted.classList.add('bg-white/50', 'text-gray-500', 'border-transparent');
    }
}

// Task Creation
if (createTaskForm) {
    createTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = createTaskForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Posting...';
        submitBtn.disabled = true;

        const title = document.getElementById('task-title').value.trim();
        const category = document.getElementById('task-category').value;
        const rewardRaw = document.getElementById('task-reward').value.trim();
        const desc = document.getElementById('task-desc').value.trim();
        const center = getMapCenter();

        const user = auth.currentUser;
        if (!user) {
            showToast("Must be logged in", 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }

        try {
            let createdTaskId = null;
            let createdRewardAmount = 0;

            await runTransaction(db, async (transaction) => {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await transaction.get(userDocRef);

                let currentBalance = 0;

                if (userDoc.exists()) {
                    currentBalance = Number(userDoc.data().balance || 0);
                } else {
                    // New user: will be created with starting balance
                    currentBalance = 500;
                }

                let rewardAmount = 0;
                if (rewardRaw !== '') {
                    rewardAmount = Number.parseFloat(rewardRaw);
                }

                const validationError = validateTaskInput({
                    title,
                    description: desc,
                    category,
                    rewardAmount,
                    userBalance: currentBalance
                });

                if (validationError) throw new Error(validationError);
                createdRewardAmount = rewardAmount;

                const newBalance = currentBalance - rewardAmount;

                if (userDoc.exists()) {
                    // Existing user: only update balance — the ONLY field allowed by
                    // validSelfUserUpdate. Writing email/createdAt here would cause permission-denied.
                    transaction.update(userDocRef, { balance: newBalance });
                } else {
                    // New user: create full doc via validUserCreate path.
                    const existing = userDoc.data ? userDoc.data() : {};
                    transaction.set(userDocRef, {
                        email: user.email || "unknown@sidequest.local",
                        name: user.displayName || user.email || "User",
                        balance: newBalance,
                        createdAt: serverTimestamp()
                    });
                }

                const newTaskRef = doc(collection(db, "tasks"));
                createdTaskId = newTaskRef.id;
                transaction.set(newTaskRef, {
                    title,
                    category,
                    reward: { amount: rewardAmount, currency: "INR" },
                    description: desc,
                    location: { lat: center.lat, lng: center.lng },
                    status: "open",
                    poster: {
                        id: user.uid,
                        name: user.displayName || user.email || "User",
                        avatar: user.photoURL || ""
                    },
                    createdAt: serverTimestamp()
                });
            });

            upsertTaskInState({
                id: createdTaskId,
                title,
                category,
                reward: { amount: createdRewardAmount, currency: 'INR' },
                description: desc,
                location: { lat: center.lat, lng: center.lng },
                status: 'open',
                poster: {
                    id: user.uid,
                    name: user.displayName || user.email || 'User',
                    avatar: user.photoURL || ''
                },
                createdAt: pseudoTimestampNow()
            });

            refreshDerivedViews();

            closeModals();
            createTaskForm.reset();
            showToast('Task posted successfully!', 'success');

        } catch (error) {
            console.error("Error adding task: ", error);
            showToast(getFirestoreErrorMessage(error, 'Failed to post task'), 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Listen for Tasks
let isTasksLoaded = false;

export function listenForTasks() {
    if (tasksUnsubscribe) tasksUnsubscribe();

    const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));

    tasksUnsubscribe = onSnapshot(q, (snapshot) => {
        allTasks = [];
        snapshot.forEach((taskDoc) => {
            const task = taskDoc.data();
            task.id = taskDoc.id;

            // Filter old open tasks out of UI. Deletion should happen in trusted backend jobs.
            if (task.status === 'open' && isOlderThan24h(task.createdAt)) {
                return;
            }

            allTasks.push(task);
        });

        isTasksLoaded = true;
        updateMarkers();

        const myTasksHidden = myTasksPage.classList.contains('hidden');
        const profileHidden = profilePage.classList.contains('hidden');

        if (!myTasksHidden) renderMyTasks();
        if (!profileHidden) renderProfile();

    }, (error) => {
        console.error("Firestore Error:", error);
        showToast("Failed to load tasks. Please refresh.", 'error');
    });
}

function isOlderThan24h(timestamp) {
    if (!timestamp || typeof timestamp.toDate !== 'function') return false;
    const diffMs = Date.now() - timestamp.toDate().getTime();
    return diffMs >= 24 * 60 * 60 * 1000;
}

function updateMarkers() {
    clearMarkers();
    if (!currentUserLocation) return;

    allTasks.forEach(task => {
        if (task.status !== 'open') return;

        if (currentCategoryFilter !== 'all' && task.category !== currentCategoryFilter) return;

        const taskTitle = String(task.title || '').toLowerCase();
        const taskDescription = String(task.description || '').toLowerCase();

        if (currentSearchQuery) {
            const textMatch = taskTitle.includes(currentSearchQuery) ||
                taskDescription.includes(currentSearchQuery);
            if (!textMatch) return;
        }

        const lat = Number(task.location?.lat);
        const lng = Number(task.location?.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

        const dist = calculateDistance(
            currentUserLocation.lat,
            currentUserLocation.lng,
            lat,
            lng
        );

        if (dist <= 0.5) {
            addMarker(task, (t) => openTaskDetail(t, dist));
        }
    });
}

function renderMyTasks() {
    const user = auth.currentUser;
    if (!user) {
        myTasksList.innerHTML = '<div class="text-center text-gray-500 mt-10">Please login to view tasks.</div>';
        return;
    }

    if (!isTasksLoaded) {
        myTasksList.innerHTML = `
            <div class="space-y-4 p-4">
                <div class="skeleton h-20 w-full"></div>
                <div class="skeleton h-20 w-full"></div>
                <div class="skeleton h-20 w-full"></div>
            </div>
        `;
        return;
    }

    const filtered = allTasks.filter(task => {
        if (myTasksTab === 'posted') {
            return task.poster?.id === user.uid;
        } else {
            return task.assignee?.id === user.uid;
        }
    });

    myTasksList.innerHTML = '';
    if (filtered.length === 0) {
        myTasksList.innerHTML = '<div class="text-center text-gray-400 mt-10">No tasks found.</div>';
        return;
    }

    filtered.forEach(task => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4';

        let statusColor = 'text-gray-500';
        if (task.status === 'completed') statusColor = 'text-green-600 font-bold';
        if (task.status === 'pending-confirmation') statusColor = 'text-orange-500 font-bold';

        const iconWrap = document.createElement('div');
        iconWrap.className = 'h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl';
        iconWrap.textContent = getCategoryIcon(task.category);

        const body = document.createElement('div');
        body.className = 'flex-1';

        const titleEl = document.createElement('h3');
        titleEl.className = 'font-bold text-gray-900';
        titleEl.textContent = String(task.title || 'Untitled task');

        const metaEl = document.createElement('p');
        metaEl.className = `text-sm ${statusColor}`;
        const rewardAmount = Number(task.reward?.amount || 0);
        const rewardText = rewardAmount > 0 ? `₹${rewardAmount}` : 'Volunteer';
        metaEl.textContent = `${taskStatusLabel(task.status)} • ${rewardText}`;

        body.append(titleEl, metaEl);

        if (task.rating) {
            const ratingEl = document.createElement('p');
            ratingEl.className = 'text-xs text-yellow-500';
            ratingEl.textContent = `★ ${task.rating}/5`;
            body.appendChild(ratingEl);
        }

        const viewBtn = document.createElement('button');
        viewBtn.className = 'px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium';
        viewBtn.type = 'button';
        viewBtn.textContent = 'View';

        card.append(iconWrap, body, viewBtn);

        card.onclick = () => {
            let dist = 0;
            if (currentUserLocation && task.location) {
                dist = calculateDistance(
                    currentUserLocation.lat,
                    currentUserLocation.lng,
                    Number(task.location.lat),
                    Number(task.location.lng)
                );
            }
            openTaskDetail(task, dist);
        };

        myTasksList.appendChild(card);
    });
}

function getCategoryIcon(cat) {
    if (cat === 'Delivery') return '📦';
    if (cat === 'Help') return '🤝';
    if (cat === 'Social') return '🎉';
    return '📌';
}

function taskStatusLabel(status) {
    if (status === 'open') return 'Open';
    if (status === 'in-progress') return 'In Progress';
    if (status === 'pending-confirmation') return 'Pending Conf.';
    if (status === 'completed') return 'Completed';
    return status;
}

function openTaskDetail(task, dist) {
    if (!detailModal) return;

    document.getElementById('detail-title').textContent = task.title;
    document.getElementById('detail-desc').textContent = task.description;

    const timeString = timeAgo(task.createdAt);
    document.getElementById('detail-time-dist').textContent = `${timeString} • ${dist.toFixed(2)} km away`;

    document.getElementById('detail-poster-name').textContent = task.poster.name;
    const priceEl = document.getElementById('detail-price');
    if (task.reward.amount > 0) {
        priceEl.textContent = `₹${task.reward.amount}`;
        priceEl.className = "bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold";
    } else {
        priceEl.textContent = "Volunteer";
        priceEl.className = "bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold";
    }

    const claimBtn = document.getElementById('claim-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const user = auth.currentUser;

    // Reset Buttons
    claimBtn.classList.add('hidden');
    deleteBtn.classList.add('hidden');
    claimBtn.disabled = false;
    claimBtn.textContent = "I'll do it!";
    claimBtn.onclick = null;
    deleteBtn.onclick = null;

    if (user && task.poster.id === user.uid) {
        // I am the POSTER
        if (task.status === 'open') {
            deleteBtn.classList.remove('hidden');
            deleteBtn.onclick = async () => {
                showConfirm("Delete Task?", "Costs will be refunded.", async () => {
                    try {
                        await runTransaction(db, async (transaction) => {
                            const taskRef = doc(db, "tasks", task.id);
                            const taskSnap = await transaction.get(taskRef);
                            if (!taskSnap.exists()) throw new Error("Task not found");

                            // Refund Poster
                            const posterId = taskSnap.data().poster.id;
                            const userRef = doc(db, "users", posterId);
                            const userSnap = await transaction.get(userRef);

                            if (userSnap.exists()) {
                                const currentBal = Number(userSnap.data().balance || 0);
                                const reward = Number(taskSnap.data().reward?.amount || 0);
                                transaction.update(userRef, { balance: currentBal + reward });
                            }

                            transaction.delete(taskRef);
                        });

                        removeTaskFromState(task.id);
                        refreshDerivedViews();

                        closeModals();
                        showToast("Task deleted & refunded", 'success');
                    } catch (e) {
                        console.error(e);
                        showToast(getFirestoreErrorMessage(e, 'Delete failed'), 'error');
                    }
                });
            };
        }

        if (task.status === 'pending-confirmation') {
            claimBtn.classList.remove('hidden');
            claimBtn.textContent = "Confirm & Rate";
            claimBtn.disabled = false;
            claimBtn.onclick = () => {
                currentRatingTask = task;
                currentRatingValue = 0;
                // Reset star and button state
                updateStarsUI(0);
                if (submitRatingBtn) {
                    submitRatingBtn.disabled = true;
                    submitRatingBtn.classList.remove('bg-primary', 'text-white');
                    submitRatingBtn.classList.add('bg-gray-200', 'text-gray-400');
                    submitRatingBtn.textContent = "Confirm & Rate";
                }
                ratingModal.classList.remove('hidden');
                if (ratingModal.querySelector('#rating-modal-backdrop')) {
                    ratingModal.querySelector('#rating-modal-backdrop').classList.remove('opacity-0');
                }
                document.getElementById('detail-modal-content').classList.add('translate-y-full');
                setTimeout(() => detailModal.classList.add('hidden'), 300);
            };
        }

    } else {
        // I am a VIEWER / ASSIGNEE

        if (task.status === 'open') {
            claimBtn.classList.remove('hidden');
            claimBtn.textContent = "I'll do it!";

            claimBtn.onclick = async () => {
                if (!user) { showToast("Please login.", 'error'); return; }
                claimBtn.textContent = "Claiming...";
                claimBtn.disabled = true;
                try {
                    await runTransaction(db, async (transaction) => {
                        const taskRef = doc(db, "tasks", task.id);
                        const taskDoc = await transaction.get(taskRef);
                        if (!taskDoc.exists()) throw new Error("Task does not exist!");
                        if (taskDoc.data().status !== 'open') throw new Error("Task already claimed!");
                        if (taskDoc.data().poster?.id === user.uid) {
                            throw new Error("You cannot claim your own task.");
                        }

                        const selfUserRef = doc(db, "users", user.uid);
                        const selfUserSnap = await transaction.get(selfUserRef);

                        if (selfUserSnap.exists()) {
                            // Existing user doc: no fields need changing for a claim.
                            // validSelfUserUpdate only allows ['name', 'balance', 'lastPayoutTaskId'].
                            // Do NOT touch email or createdAt — it would cause permission-denied.
                            // If balance is missing/corrupt, fix it only.
                            const existingBalance = selfUserSnap.data().balance;
                            if (typeof existingBalance !== 'number') {
                                transaction.update(selfUserRef, { balance: 0 });
                            }
                            // name field is consistent from auth — no update needed here.
                        } else {
                            // New user: create full doc via validUserCreate path.
                            transaction.set(selfUserRef, {
                                email: user.email || "unknown@sidequest.local",
                                name: user.displayName || user.email || "User",
                                balance: 0,
                                createdAt: serverTimestamp()
                            });
                        }

                        transaction.update(taskRef, {
                            status: "in-progress",
                            assignee: {
                                id: user.uid,
                                name: user.displayName || user.email || "User"
                            }
                        });
                    });

                    patchTaskInState(task.id, {
                        status: 'in-progress',
                        assignee: {
                            id: user.uid,
                            name: user.displayName || user.email || 'User'
                        }
                    });
                    refreshDerivedViews();

                    closeModals();
                    showToast("Task successfully claimed!", 'success');
                } catch (e) {
                    showToast(getFirestoreErrorMessage(e, 'Failed to claim task'), 'error');
                    claimBtn.disabled = false;
                    claimBtn.textContent = "I'll do it!";
                    // Refresh modal if task changed? Ideally close it to force refresh from map
                    if (String(e.message || '').toLowerCase().includes("already claimed")) {
                        setTimeout(closeModals, 1500);
                    }
                }
            };

        } else if (task.status === 'in-progress' && task.assignee?.id === user?.uid) {
            claimBtn.classList.remove('hidden');
            claimBtn.textContent = "Mark as Done";

            claimBtn.onclick = async () => {
                try {
                    await updateDoc(doc(db, "tasks", task.id), { status: "pending-confirmation" });

                    patchTaskInState(task.id, { status: 'pending-confirmation' });
                    refreshDerivedViews();

                    showToast("Marked as done! Wait for poster to confirm.", 'success');
                    closeModals();
                } catch (e) {
                    showToast(getFirestoreErrorMessage(e, 'Failed to mark task as done'), 'error');
                }
            };
        } else if (task.status === 'pending-confirmation' && task.assignee?.id === user?.uid) {
            claimBtn.classList.remove('hidden');
            claimBtn.textContent = "Waiting for Confirmation...";
            claimBtn.disabled = true;
        }
    }

    detailModal.classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('detail-modal-content').classList.remove('translate-y-full');
    }, 10);
}

function timeAgo(firebaseTimestamp) {
    if (!firebaseTimestamp) return '';
    const date = firebaseTimestamp.toDate();
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
    const years = Math.floor(days / 365);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
}
