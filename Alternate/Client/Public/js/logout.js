document.addEventListener("DOMContentLoaded", init);

function init() {
    let x=document.getElementById("portfolio");
    x.addEventListener("click",function(){document.location.href='/portfolio'});
    let y=document.getElementById("yourAccount");
    y.addEventListener("click",function(){document.location.href='/account'});
    let z=document.getElementById("home");
    z.addEventListener("click",function(){document.location.href='/home'});
}
//calls logout in accountController
function logout() {
    // Assuming you have a route on the server to handle logout, for example, '/logout'
    fetch('api/account/logout', {
        method: 'POST', // or 'GET' based on your server setup
        headers: {
            'Content-Type': 'application/json',
        },
        // Add any necessary data in the body, if required
    })
        .then(response => {
            if (response.ok) {
                // Redirect to the /index page
                window.location.href = '/index';
            } else {
                console.error('Logout failed.');
                // Handle the logout failure, maybe show an error message
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
            // Handle the error, maybe show an error message
        });
}
