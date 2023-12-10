function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginData = {
        username: username,
        password: password,
        isAdmin: false,
        adminPassword: ""
    };
    TryLogin(loginData, "/home");
}

function signUp() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginData = {
        username: username,
        password: password,
        isAdmin: false,
        adminPassword: ""
    };
    TrySignUp(loginData, "/home");
}

async function TryLogin(loginData, page) {
    try {
        const response = await fetch("/api/account/login", {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify(loginData),
        });
        if (!response.ok) {throw new Error('Network response was not ok');}
        const data = await response.json();
        console.log('Login request sent:', data);
        if (data.loginValid) document.location.href='/home';
        else alert(data.message);
    } catch (error) {
        console.error('Error during login:', error);
    }
}

async function TrySignUp(loginData, page) {
    try {
        const response = await fetch("/api/account/create", {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify(loginData),
        });
        if (!response.ok) {throw new Error('Network response was not ok');}
        const data = await response.json();
        console.log('Account creation request sent:', data);
        if (data.createValid) document.location.href='/home';
        else alert(data.message);
    } catch (error) {
        console.error('Error creating account:', error);
    }
}