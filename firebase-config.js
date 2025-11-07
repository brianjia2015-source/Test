// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app, auth, db;

if (typeof firebase !== 'undefined') {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
}

// Auth State Management
let currentUser = null;

auth.onAuthStateChanged((user) => {
    currentUser = user;
    updateUIForUser(user);
    if (user) {
        checkAdminStatus(user.uid);
    }
});

// Check if user is admin
async function checkAdminStatus(uid) {
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        const userData = userDoc.data();
        if (userData && userData.role === 'admin') {
            showAdminFeatures();
        }
    } catch (error) {
        console.error('Error checking admin status:', error);
    }
}

// Update UI based on auth state
function updateUIForUser(user) {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    if (user) {
        loginBtn.textContent = user.email;
        loginBtn.onclick = () => showUserMenu();
        signupBtn.textContent = 'Logout';
        signupBtn.onclick = () => logout();
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = () => showLoginModal();
        signupBtn.textContent = 'Sign Up';
        signupBtn.onclick = () => showSignupModal();
    }
}

// Login function
async function login(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        showNotification('Login successful!', 'success');
        closeModal();
        return userCredential.user;
    } catch (error) {
        showNotification(`Login failed: ${error.message}`, 'error');
        throw error;
    }
}

// Signup function
async function signup(email, password, fullName) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Create user profile in Firestore
        await db.collection('users').doc(user.uid).set({
            email: email,
            fullName: fullName,
            role: 'user',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            verified: false
        });
        
        showNotification('Account created successfully!', 'success');
        closeModal();
        return user;
    } catch (error) {
        showNotification(`Signup failed: ${error.message}`, 'error');
        throw error;
    }
}

// Logout function
async function logout() {
    try {
        await auth.signOut();
        showNotification('Logged out successfully', 'success');
        hideAdminFeatures();
    } catch (error) {
        showNotification(`Logout failed: ${error.message}`, 'error');
    }
}

// Show admin features
function showAdminFeatures() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.style.display = 'block';
    }
    
    // Add admin menu item
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && !document.getElementById('adminNavLink')) {
        const adminLi = document.createElement('li');
        adminLi.id = 'adminNavLink';
        adminLi.innerHTML = '<a href="#admin">Admin Panel</a>';
        navMenu.appendChild(adminLi);
    }
}

// Hide admin features
function hideAdminFeatures() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.style.display = 'none';
    }
    
    const adminNavLink = document.getElementById('adminNavLink');
    if (adminNavLink) {
        adminNavLink.remove();
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { auth, db, login, signup, logout, showNotification };
}
