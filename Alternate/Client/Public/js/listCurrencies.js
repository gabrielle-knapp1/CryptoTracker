const apiKey = 'ccbbd297-efee-408f-8a20-85e05ec55d66'; // Replace with your actual API key
const apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

document.addEventListener("DOMContentLoaded", init);

function init() {
    let x=document.getElementById("logout");
    x.addEventListener("click",function(){document.location.href='/logout'});
    let y=document.getElementById("portfolio");
    y.addEventListener("click",function(){document.location.href='/portfolio'});
    let z=document.getElementById("yourAccount");
    z.addEventListener("click",function(){document.location.href='/account'});
}

// Define the getCurrencies function in the global scope
window.getCurrencies = async function getCurrencies() {
    try {
        const response = await fetch('/api/crypto/get', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.success) {
            const cryptoTableBody = document.getElementById('cryptoTableBody');
            cryptoTableBody.innerHTML = '';

            data.body.forEach((crypto, index) => {
                const row = cryptoTableBody.insertRow();
                const cellIndex = row.insertCell(0);
                const cellName = row.insertCell(1);
                const cellSymbol = row.insertCell(2);
                const cellPrice = row.insertCell(3);
                const cellChange = row.insertCell(4);
                const purchase = row.insertCell(5);

                // Create a button and append it to the cell
                const button = createButton(index + 1, () => viewDetail(crypto.name));
                cellIndex.appendChild(button);

                // Populate cells with data
                cellName.textContent = crypto.name;
                cellSymbol.textContent = crypto.symbol;
                cellPrice.textContent = crypto.quote.USD.price.toFixed(2);
                cellChange.textContent = crypto.quote.USD.percent_change_24h.toFixed(2);
                const buyButton = createButton("Buy Crypto", () => buyCrypto(crypto));
                purchase.appendChild(buyButton);
            });
        }
    } catch (error) {
        console.error('Error fetching crypto data:', error);
        alert('An error occurred while fetching crypto data');
    }
}

async function viewDetail(index) {
    alert("looking at " + index);
    try {
        const response = await fetch(`/api/crypto/detail/${index}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.success) {
        const correctCurrency = data.body;
        if (correctCurrency) {
            console.log("success!");
            const modalContent = document.getElementById('modalContent');
            modalContent.innerHTML = `<p>ID: ${correctCurrency.id}</p>
                                          <p>Name: ${correctCurrency.name}</p>
                                          <p>Symbol: ${correctCurrency.symbol}</p>
                                          <p>Date Added: ${correctCurrency.date_added}</p>
                                          <p>Date Last Updated: ${correctCurrency.quote.USD.last_updated}</p>
                                          <p>Price: ${correctCurrency.quote.USD.price.toFixed(2)}</p>
                                          <p>Max Supply: ${correctCurrency.max_supply}</p>
                                          <p>Volume 24H: ${correctCurrency.quote.USD.volume_24h.toFixed(2)}</p>
                                          <p>Volume Change 24H: ${correctCurrency.quote.USD.volume_change_24h.toFixed(2)}</p>
                                          <p>Percent Change 1H: ${correctCurrency.quote.USD.percent_change_1h.toFixed(2)}</p>
                                          <p>Percent Change 24H: ${correctCurrency.quote.USD.percent_change_24h.toFixed(2)}</p>
                                          <p>Percent Change 7D: ${correctCurrency.quote.USD.percent_change_7d.toFixed(2)}</p>
                                          <p>Percent Change 30D: ${correctCurrency.quote.USD.percent_change_30d.toFixed(2)}</p>
                                          <p>Percent Change 60D: ${correctCurrency.quote.USD.percent_change_60d.toFixed(2)}</p>
                                          <p>Percent Change 90D: ${correctCurrency.quote.USD.percent_change_90d.toFixed(2)}</p>
                                          <p>Market Cap: ${correctCurrency.quote.USD.market_cap.toFixed(2)}</p>
                                          <p>Market Cap Dominance: ${correctCurrency.quote.USD.market_cap_dominance.toFixed(2)}</p>
                                          <p>Fully Diluted Market Cap: ${correctCurrency.quote.USD.fully_diluted_market_cap.toFixed(2)}</p>`;
            document.getElementById('cryptoModal').showModal();
        }
    } 
}
    catch (error) {
        console.error('Error fetching crypto data:', error);
        alert('An error occurred while fetching crypto data');
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
const closeModalButton = document.getElementById('closeModal');
const cryptoModal = document.getElementById('cryptoModal');
async function buyCrypto(crypto) {
    try {
      // Prompt the user for the amount of crypto to buy
      const amount = prompt(`How much of ${crypto.name} do you want to buy?`);
  
      if (amount === null) {
        // User clicked "Cancel" in the prompt
        return;
      }
  
      // Convert the amount to a number (assuming it's a valid number)
      const numericAmount = parseFloat(amount);
  
      if (isNaN(numericAmount) || numericAmount <= 0) {
        // Invalid input or amount <= 0
        alert('Please enter a valid positive number for the amount.');
        return;
      }
  
      const purchaseTime = new Date().toISOString();
  
      const response = await fetch(`/api/portfolio/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: crypto.symbol,
          name: crypto.name,
          amount: numericAmount,
          purchaseTime,
          price: crypto.quote.USD.price.toFixed(2),
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
  
      if (data.success) {
        alert('Purchase Successful - view in portfolio');
      }
    } catch (error) {
      console.error('Error making purchase:', error);
      alert('An error occurred while making a purchase');
    }
  }
/*
async function buyCrypto(symbol, name){
    try {
        const response = await fetch('/api/portfolio/buy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({symbol, name})
        });
        if (!response.ok) {throw new Error('Network response was not ok');}
            const data = await response.json();
            //console.log(data);
            if (data.success) {
                alert("Purchase Successful- view in portfolio");
            }
    }
        catch (error) {
            console.error('Error making purchase:', error);
            alert('An error occurred while making a purchase');
        }
}
*/
closeModalButton.addEventListener('click', () => {
    cryptoModal.close();
});