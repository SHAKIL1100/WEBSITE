/**
 * GrShop - JavaScript Business Logic
 * Features: Auth Management, Input Validation, UI State Handling
 */

document.addEventListener("DOMContentLoaded", function() {
    // Check if user is already logged in via LocalStorage
    const userSession = localStorage.getItem("grshop_active_session");
    
    if (userSession === "true") {
        renderApp("main");
    } else {
        renderApp("auth");
    }
});

// --- UI State Controller ---
function renderApp(view) {
    const authUI = document.getElementById("auth-container");
    const mainUI = document.getElementById("main-content");

    if (view === "main") {
        authUI.classList.add("hidden");
        mainUI.classList.remove("hidden");
        document.body.style.overflow = "auto";
    } else {
        authUI.classList.remove("hidden");
        mainUI.classList.add("hidden");
        document.body.style.overflow = "hidden";
    }
}

// --- Auth Toggle (Login <-> Signup) ---
function toggleAuth(mode) {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    if (mode === 'signup') {
        loginForm.style.display = "none";
        signupForm.style.display = "block";
        signupForm.classList.remove("hidden");
    } else {
        signupForm.style.display = "none";
        loginForm.style.display = "block";
        loginForm.classList.remove("hidden");
    }
}

// --- Sign Up Logic ---
function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const pass = document.getElementById("signup-pass").value.trim();

    // Basic Validation
    if (name.length < 3) {
        showNotify("Name is too short!", "error");
        return;
    }
    if (pass.length < 6) {
        showNotify("Password must be at least 6 characters.", "error");
        return;
    }

    // Save to LocalStorage (Pseudo-Database)
    localStorage.setItem("db_user_email", email);
    localStorage.setItem("db_user_pass", pass);
    localStorage.setItem("db_user_name", name);

    showNotify("Account created! You can login now.", "success");
    toggleAuth('login');
}

// --- Login Logic ---
function handleLogin(event) {
    event.preventDefault();

    const emailInput = document.getElementById("login-email").value.trim();
    const passInput = document.getElementById("login-pass").value.trim();

    // Retrieve saved data or use defaults
    const savedEmail = localStorage.getItem("db_user_email") || "admin@grshop.com";
    const savedPass = localStorage.getItem("db_user_pass") || "123456";

    if (emailInput === savedEmail && passInput === savedPass) {
        localStorage.setItem("grshop_active_session", "true");
        showNotify("Login successful. Welcome back!", "success");
        
        // Delay redirect for user to see success message
        setTimeout(() => {
            renderApp("main");
        }, 800);
    } else {
        showNotify("Invalid email or password.", "error");
    }
}

// --- Logout Logic ---
function handleLogout() {
    localStorage.removeItem("grshop_active_session");
    showNotify("Logged out successfully.", "info");
    setTimeout(() => {
        location.reload();
    }, 500);
}

// --- Purchase Action ---
function buyAlert(product) {
    // Beautiful alert for buying
    const msg = `Order Initiated: ${product}\n\nTo complete payment and receive your accounts, please contact our support bot on Telegram.`;
    alert(msg);
}

// --- Custom Notification (Toast) ---
function showNotify(message, type) {
    // For simplicity, using standard alert but can be upgraded to custom HTML toast
    console.log(`[${type.toUpperCase()}]: ${message}`);
    alert(message);
}