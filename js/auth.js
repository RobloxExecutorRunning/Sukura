// --- Elements ---
const mainBtn = document.getElementById('main-btn');
const switchBtn = document.getElementById('switch-btn');
const title = document.getElementById('form-title');
const ownerToggle = document.getElementById('owner-toggle');

let isLoginMode = true;

// --- Toggle between Login and Signup UI ---
switchBtn.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    if (isLoginMode) {
        title.innerText = "Login for Free Layers";
        mainBtn.innerText = "Login";
        switchBtn.innerText = "Create Account";
    } else {
        title.innerText = "Create Account";
        mainBtn.innerText = "Sign Up";
        switchBtn.innerText = "Back to Login";
    }
});

// --- Handle Login/Signup Button ---
mainBtn.addEventListener('click', async () => {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (!user || !pass) return alert("Fill in all fields!");

    try {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: user, 
                password: pass, 
                type: isLoginMode ? 'login' : 'signup' 
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            if (isLoginMode) {
                // If login works, you could redirect or show their items
                console.log("User Layers:", data.layers);
            } else {
                // If signup works, refresh to let them login
                location.reload();
            }
        } else {
            alert("Error: " + data.message);
        }
    } catch (err) {
        alert("Server error. Make sure your Vercel KV is connected!");
    }
});

// --- Owner Panel Access ---
ownerToggle.addEventListener('click', async () => {
    const adminUser = "20ia"; // Matches your admin.js
    const adminPass = prompt("Enter Owner Password:");

    if (!adminPass) return;

    try {
        const response = await fetch('/api/admin', {
            method: 'GET',
            headers: { 
                'admin-user': adminUser, 
                'admin-pass': adminPass 
            }
        });

        if (response.ok) {
            const users = await response.json();
            
            // Hide the login card and show the admin panel
            document.getElementById('auth-card').style.display = 'none';
            document.getElementById('admin-panel').style.display = 'block';
            document.getElementById('current-admin').innerText = adminUser;
            
            const tableBody = document.getElementById('user-table-body');
            tableBody.innerHTML = ''; // Clear the table first

            // Fill table with the database info
            users.forEach(u => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${u.username}</td>
                        <td>${u.password}</td>
                        <td>${u.layers}</td>
                    </tr>`;
            });
        } else {
            const errData = await response.json();
            alert(errData.message || "Access Denied");
        }
    } catch (err) {
        alert("Could not connect to Admin API.");
    }
});
