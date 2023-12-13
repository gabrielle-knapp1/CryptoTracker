document.addEventListener('DOMContentLoaded', () => {
    RefreshTable();
    inits();
});
function inits() {
    let x=document.getElementById("logout");
    x.addEventListener("click",function(){document.location.href='/logout'});
    let y=document.getElementById("yourAccount");
    y.addEventListener("click",function(){document.location.href='/account'});
    let z=document.getElementById("home");
    z.addEventListener("click",function(){document.location.href='/home'});
}
async function RefreshTable() {
    try {
        const response = await fetch('/api/portfolio/get', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {throw new Error('Network response was not ok');}
        const data = await response.json();
        console.log(data);
        if (data.success) {
            // Assume you have an array containing portfolio data called "portfolio"
            const portfolio = data.portfolioData;
            // Get the table body element
            const tableBody = document.querySelector('tbody');
            tableBody.innerHTML = '';

            // Populate the table with item data
            portfolio.forEach(item => {
                const row = document.createElement('tr');
                row.name = `itemEntry${item.name}`;
                row.appendChild(document.createElement('td')).textContent = item.name;
                row.appendChild(document.createElement('td')).textContent = item.symbol;
                row.appendChild(document.createElement('td')).textContent = item.price;
                row.appendChild(document.createElement('td')).textContent = item.amount;
                row.appendChild(document.createElement('td')).textContent = item.pPrice;
                row.appendChild(document.createElement('td')).textContent = item.bValue;
                row.appendChild(document.createElement('td')).textContent = item.cValue;
                row.appendChild(document.createElement('td')).textContent = item.cValue-item.bValue;
                row.appendChild(createButton("Sell Item", () => sellCrypto(item.name)));
                tableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error fetching portfolio data:', error);
        alert('An error occurred while fetching portfolio data');
    }
}

function createButton(text, clickHandler) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.classList.add('action-button'); // Add a CSS class for styling
    button.addEventListener('click', clickHandler);
    return button;
}

async function sellCrypto (name){
    try {
        const response = await fetch('/api/portfolio/sell', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name})
        });
        if (!response.ok) {throw new Error('Network response was not ok');}
            const data = await response.json();
            //console.log(data);
            if (data.success) {
                alert("Sale Successful- refresh portfolio");
            }
    }
        catch (error) {
            console.error('Error making sale:', error);
            alert('An error occurred while selling currency');
        }
}
