// js/app.js
import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { initMap, flyToUserLocation } from './map.js';
import { listenForTasks, listenToUser, stopTaskRealtimeListeners } from './tasks.js';

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const authPage = document.getElementById('auth-page');
const appPage = document.getElementById('app-page-map');
const logoutBtn = document.getElementById('profile-logout-btn'); // Changed ID
const locateBtn = document.getElementById('locate-btn');

// Initialize App
function init() {
    console.log("Initializing SideQuest...");

    // UI Listeners
    if (locateBtn) {
        locateBtn.addEventListener('click', () => {
            flyToUserLocation();
        });
    }

    // Auth Listener
    onAuthStateChanged(auth, (user) => {
        // Fake a little delay for the splash screen effect
        setTimeout(() => {
            loadingScreen.classList.add('opacity-0');
            setTimeout(() => loadingScreen.classList.add('hidden'), 500);

            if (user) {
                // User is signed in
                console.log("User logged in:", user.uid);
                showApp(user);
            } else {
                // User is signed out
                console.log("User logged out");
                showAuth();
            }
        }, 800);
    });

    // Logout Handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            import('./auth.js').then(module => module.logout());
        });
    }
}

function showAuth() {
    stopTaskRealtimeListeners();

    authPage.classList.remove('hidden');
    appPage.classList.add('hidden');
    // Ensure profile page is also hidden
    const profilePage = document.getElementById('profile-page');
    if (profilePage) profilePage.classList.add('hidden');

    // Ensure My Tasks page is hidden after sign-out
    const myTasksPage = document.getElementById('my-tasks-page');
    if (myTasksPage) myTasksPage.classList.add('hidden');
}

function showApp(user) {
    authPage.classList.add('hidden');
    appPage.classList.remove('hidden');

    // Initialize Map if not already done
    initMap(user);
    listenForTasks(); // Start real-time listener
    listenToUser(user.uid); // Start real-time user listener
}

// Start
init();
