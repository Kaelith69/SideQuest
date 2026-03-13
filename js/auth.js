// js/auth.js
import { auth } from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from './firebase-config.js';

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const toggleAuthBtn = document.getElementById('toggle-auth');
const authError = document.getElementById('auth-error');

let isLoginMode = true;

// Toggle Login/Signup
if (toggleAuthBtn) {
    toggleAuthBtn.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        if (isLoginMode) {
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
            toggleAuthBtn.textContent = 'New to SideQuest? Sign Up';
        } else {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
            toggleAuthBtn.textContent = 'Already have an account? Sign In';
        }
        authError.classList.add('hidden');
    });
}

// Handle Login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            showError('Please enter your email and password.');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Auth listener in app.js will handle redirect
        } catch (error) {
            showError(getFriendlyAuthError(error.code));
        }
    });
}

// Handle Signup
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;

        // Client-side validation (mirrors Firestore rules)
        if (name.length < 1 || name.length > 80) {
            showError('Name must be between 1 and 80 characters.');
            return;
        }
        if (!email || email.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('Please enter a valid email address.');
            return;
        }
        if (password.length < 6) {
            showError('Password must be at least 6 characters.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update Auth Profile
            await updateProfile(user, { displayName: name });

            // Create User Doc with serverTimestamp() — MUST match Firestore rules:
            // validUserCreate requires createdAt is timestamp (Firebase Timestamp, not JS Date).
            await setDoc(doc(db, "users", user.uid), {
                email: email,
                name: name,
                balance: 500, // Initial demo balance
                createdAt: serverTimestamp()
            });

            // Auth listener in app.js will handle redirect
        } catch (error) {
            showError(getFriendlyAuthError(error.code, error.message));
        }
    });
}

// Logout
export async function logout() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout failed", error);
    }
}

function getFriendlyAuthError(code, fallback) {
    switch (code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Invalid email or password.';
        case 'auth/email-already-in-use':
            return 'This email is already registered. Try signing in.';
        case 'auth/weak-password':
            return 'Password must be at least 6 characters.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please wait a moment and try again.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection and try again.';
        default:
            return fallback
                ? fallback.replace('Firebase:', '').trim()
                : 'An unexpected error occurred. Please try again.';
    }
}

function showError(msg) {
    authError.textContent = msg;
    authError.classList.remove('hidden');
}
