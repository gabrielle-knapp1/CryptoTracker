//here i will manipulate the data for the portfolio of each account
const mysql = require('../mysql');
const axios = require('axios');
const apiKey = 'ccbbd297-efee-408f-8a20-85e05ec55d66';
const apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

async function getPortfolio(req, res) {
    try {
        const cart = await mysql.selectQuery(
            "SELECT portfolio.name FROM portfolio WHERE username=?",
            [req.session.username]
        );
    
        const transaction = await mysql.selectQuery(
            "SELECT transaction.symbol, transaction.amount, transaction.price FROM transaction WHERE username=?",
            [req.session.username]
        );
    
        console.log("cart data: ", cart);
        console.log("transaction data: ", transaction);
        const portfolioData = [];

        for (let i = 0; i < cart.length; i++) {
            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        'X-CMC_PRO_API_KEY': apiKey,
                    },
                });

                const json = response.data;
                const dataOb = json.data;
                console.log("dataOb 0 name:", dataOb[0].name);

                for (let j = 0; j < dataOb.length; j++) {
                    if (dataOb[j].name === cart[i].name) {
                        console.log("match!");
                        const currencyInfo = {
                            name: dataOb[j].name,
                            symbol: dataOb[j].symbol,
                            price: dataOb[j].quote.USD.price.toFixed(2),
                            amount: transaction[i].amount,
                            pPrice: transaction[i].price.toFixed(2),
                            bValue: transaction[i].price *transaction[i].amount,
                            cValue: dataOb[j].quote.USD.price.toFixed(2) *transaction[i].amount
                        };
                        portfolioData.push(currencyInfo);
                        break; // exit the loop once the correct currency is found
                    }
                }
            } catch (error) {
                console.error('Error fetching crypto data:', error);
            }
        }
        if (portfolioData.length > 0) {
            // Send the JSON response back to the client
            console.log("sending ", portfolioData);
            res.send({ success: true, portfolioData });
        }
        else {
            // Send an error response back to the client
            res.status(500).json({
                success: false,
                message: 'No Currencies Detected',
            });
        }
    }
    catch (error) {
        console.log("portfolioData: ", portfolioData);
        console.error('Error fetching crypto data:', error);
        res.status(500).send({ success: false, message: 'An error occurred while fetching crypto data' });
    }
}

async function buyCrypto(req, res) {
    let response = {
        success: true,
        message: "Purchase Successful"
    }
    // Assuming purchaseTime is your ISO 8601 datetime string
    const purchaseTime = new Date().toISOString();

    // Convert ISO 8601 datetime to MySQL datetime format
    const mysqlDatetime = purchaseTime.replace('T', ' ').replace('Z', '');
    //make transaction log
    try {
        mysql.insertQuery("insert into portfolio(username, symbol, name) values (?, ?, ?)", [req.session.username, req.body.symbol, req.body.name]);

        // Check if the inserted symbol exists in the portfolio table
        const portfolioCheck = await mysql.selectQuery("select * from portfolio where username=? and symbol=?", [req.session.username, req.body.symbol]);

        if (portfolioCheck.length > 0) {
            // Symbol exists in the portfolio, proceed to insert into the transaction table
            mysql.insertQuery("insert into transaction(username, symbol, amount, price, trans_date) values (?, ?, ?, ?, ?)", [req.session.username, req.body.symbol, req.body.amount, req.body.price, `${mysqlDatetime}`]);

            res.send(response);
        }
    }
    catch (error) {
        console.error('Error Inserting to Database:', error);
        res.status(500).send({ success: false, message: 'An error occurred while inserting data' });
    }
}

async function sellCrypto(req, res) {
    const name = req.body.name;
    try {
        mysql.insertQuery("delete from portfolio where username=? and name =?", [req.session.username, name]);
        res.send({ success: true });
    } catch (error) {
        console.error('Error removing item from database:', error);
        alert('An error occurred while removing item from database');
    }
}

module.exports = {
    getPortfolio,
    buyCrypto,
    sellCrypto,
};