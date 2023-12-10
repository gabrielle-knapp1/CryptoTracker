document.addEventListener('DOMContentLoaded', () => {
    getAccount();
    document.getElementById('updateForm').addEventListener('submit', (event) => {
        event.preventDefault();
        updateAccount();
    });
    init();
});

function init() {
    let x=document.getElementById("logout");
    x.addEventListener("click",function(){document.location.href='/logout'});
    let y=document.getElementById("portfolio");
    y.addEventListener("click",function(){document.location.href='/portfolio'});
    let z=document.getElementById("home");
    z.addEventListener("click",function(){document.location.href='/home'});
}

//this works!
async function getAccount() {
    try {
        const response = await fetch('/api/account', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {throw new Error('Network response was not ok');}
        const data = await response.json();
        if (data.success) {
            document.getElementById('username').innerText += " " + data.account.username;
            document.getElementById('firstName').innerText += " " + data.account.firstName;
            document.getElementById('lastName').innerText += " " + data.account.lastName;
            document.getElementById('DOB').innerText += " " + data.account.DOB;
        } else {
            console.error('Failed to get account info');
            alert('Failed to get account info');
        }
    } catch (error) {
        console.error('Failed to get account info:', error);
        alert('Failed to get account info');
    }
}
//currently it doesn't work right, throws error and doesn't update
async function updateAccount() {
    try {
        const username = document.getElementById('usernameInput').value;
        const password = document.getElementById('passwordInput').value;
        const firstName = document.getElementById('firstNameInput').value;
        const lastName = document.getElementById('lastNameInput').value;
        const address = document.getElementById('DOBInput').value;
        const ogUsername = document.getElementById('username').innerText.substring(10);

        const response = await fetch('/api/account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, firstName, lastName, DOB, password, ogUsername }),
        });
        if (!response.ok) {throw new Error('Network response was not ok');}
        const data = await response.json();
        if (data.success) {
            location.reload();
        } else {
            console.error('Update request failed:');
            alert('Could not update account:' + data.message);
        }
    } catch (error) {
        console.error('Error updating account information:', error);
        alert('An error occurred while updating account info');
    }
}
//works
function ConfirmDeleteAccount() {
    const userConfirmed = confirm('Are you sure you want to delete your account?');
    console.log(userConfirmed);
    if (userConfirmed) DeleteAccount();
    return userConfirmed;
}

//deletes the account BUT an error is thrown
async function DeleteAccount() {
    try {
        const response = await fetch('/api/account', {
            method: 'DELETE'
        });
        if (!response.ok) {throw new Error('Network response was not ok');}
        const data = await response.json();
        console.log(data);
        if (data.success) ChangePage("/");
    } catch (error) {
        console.error('Error deleting account:', error);
        alert('An error occurred while deleting your account');
    }
}
//unsure if this works and if it does where it is called
async function GoHome() {
    try {
        const response = await fetch('/api/account/session', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {throw new Error('Network response was not ok');}
        console.log(response);
        const data = await response.json();
        console.log(data);
        ChangePage("/home");
    } catch (error) {
        console.error('Failed to get session info:', error);
        alert('Failed to get session info');
    }
}