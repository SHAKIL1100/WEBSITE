/**
 * GrShop - JavaScript Business Logic
 * Features: Premium Auth Management, Toast Notifications, Session Control
 */

document.addEventListener("DOMContentLoaded", function() {
    // Initializing the application state
    const userSession = localStorage.getItem("grshop_active_session");
    
    // Check session and route to correct view
    if (userSession === "true") {
        renderApp("main");
    } else {
        renderApp("auth");
    }
    
    // Setup Toast Container
    if (!document.getElementById('toast-container')) {
        const tc = document.createElement('div');
        tc.id = 'toast-container';
        document.body.appendChild(tc);
    }
});

// --- UI State Controller ---
function renderApp(view) {
    const authUI = document.getElementById("auth-container");
    const mainUI = document.getElementById("main-content");

    if (view === "main") {
        if(authUI) authUI.classList.add("hidden");
        if(mainUI) mainUI.classList.remove("hidden");
        document.body.style.overflow = "auto";
    } else {
        if(authUI) authUI.classList.remove("hidden");
        if(mainUI) mainUI.classList.add("hidden");
        document.body.style.overflow = "hidden";
    }
}

// --- Auth Toggle (Login <-> Signup) ---
function toggleAuth(mode) {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    if (mode === 'signup') {
        loginForm.classList.add("hidden");
        signupForm.classList.remove("hidden");
    } else {
        signupForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
    }
}

// --- Sign Up Logic ---
function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const pass = document.getElementById("signup-pass").value.trim();

    if (name.length < 3) {
        showNotify("Name is too short!", "error");
        return;
    }
    if (pass.length < 6) {
        showNotify("Password must be at least 6 characters.", "error");
        return;
    }

    // Pseudo-Database Storage
    localStorage.setItem("db_user_email", email);
    localStorage.setItem("db_user_pass", pass);
    localStorage.setItem("db_user_name", name);

    showNotify("Account created! Please login.", "success");
    toggleAuth('login');
}

// --- Login Logic ---
function handleLogin(event) {
    event.preventDefault();

    const emailInput = document.getElementById("login-email").value.trim();
    const passInput = document.getElementById("login-pass").value.trim();

    const savedEmail = localStorage.getItem("db_user_email") || "admin@grshop.com";
    const savedPass = localStorage.getItem("db_user_pass") || "123456";

    if (emailInput === savedEmail && passInput === savedPass) {
        localStorage.setItem("grshop_active_session", "true");
        showNotify("Welcome back to GrShop!", "success");
        
        setTimeout(() => {
            renderApp("main");
        }, 1000);
    } else {
        showNotify("Invalid credentials. Try again.", "error");
    }
}

// --- Logout Logic ---
function handleLogout() {
    localStorage.removeItem("grshop_active_session");
    showNotify("Logged out. See you soon!", "info");
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// --- Purchase Action ---
function buyAlert(product) {
    showNotify(`Redirecting to payment for ${product}...`, "info");
    setTimeout(() => {
        alert(`Order for ${product} initiated.\nContact support on Telegram to complete payment.`);
    }, 500);
}

// --- Premium Toast Notification System ---
function showNotify(message, type) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = "fa-circle-info";
    if(type === 'success') icon = "fa-circle-check";
    if(type === 'error') icon = "fa-circle-exclamation";

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}