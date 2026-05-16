document.addEventListener("DOMContentLoaded", function() {
    // Session Check
    const session = localStorage.getItem("grshop_session");
    if (session === "true") {
        showView("main");
        const name = localStorage.getItem("saved_name") || "Account";
        document.getElementById("display-name").innerText = name;
    } else {
        showView("auth");
    }

    // Dropdown Trigger - This is the fix!
    const profileTrigger = document.getElementById("profile-trigger");
    const userMenu = document.getElementById("user-menu");

    if (profileTrigger) {
        profileTrigger.addEventListener("click", function(event) {
            event.stopPropagation(); // Stop event from closing menu immediately
            userMenu.classList.toggle("hidden");
        });
    }

    // Close menu when clicking anywhere else
    window.addEventListener("click", function(e) {
        if (userMenu && !userMenu.contains(e.target)) {
            userMenu.classList.add("hidden");
        }
    });
});

function showView(view) {
    const auth = document.getElementById("auth-container");
    const main = document.getElementById("main-content");
    if (view === "main") {
        auth.classList.add("hidden");
        main.classList.remove("hidden");
        document.body.style.overflow = "auto";
    } else {
        auth.classList.remove("hidden");
        main.classList.add("hidden");
        document.body.style.overflow = "hidden";
    }
}

function toggleAuth(type) {
    const login = document.getElementById("login-form");
    const signup = document.getElementById("signup-form");
    if (type === 'signup') {
        login.classList.add("hidden");
        signup.classList.remove("hidden");
    } else {
        signup.classList.add("hidden");
        login.classList.remove("hidden");
    }
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const pass = document.getElementById("signup-pass").value;

    localStorage.setItem("saved_name", name);
    localStorage.setItem("saved_email", email);
    localStorage.setItem("saved_pass", pass);
    localStorage.setItem("grshop_session", "true");

    triggerToast("Account Created Successfully!", "success");
    setTimeout(() => location.reload(), 1000);
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const pass = document.getElementById("login-pass").value;

    const dbEmail = localStorage.getItem("saved_email") || "admin@grshop.com";
    const dbPass = localStorage.getItem("saved_pass") || "123456";

    if (email === dbEmail && pass === dbPass) {
        localStorage.setItem("grshop_session", "true");
        triggerToast("Login Successful!", "success");
        setTimeout(() => location.reload(), 800);
    } else {
        triggerToast("Invalid credentials!", "error");
    }
}

function handleLogout() {
    localStorage.removeItem("grshop_session");
    location.reload();
}

function buyAlert(item) {
    triggerToast(`Processing order for ${item}...`, "success");
}

function triggerToast(msg, type) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}