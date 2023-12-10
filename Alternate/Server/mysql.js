const mysql = require('mysql2');
const axios = require('axios');

const apiKey = 'ccbbd297-efee-408f-8a20-85e05ec55d66';
const apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

const connection = mysql.createConnection({
    host: 'localhost',
    //make hash so it is not viewable by malicious user
    user: 'root',
    password: 'root',
    database: 'Crypto'
});

connection.connect((error) => {
    if(error){
      console.log('Error connecting to the MySQL Database');
      return;
    }
    console.log('Connection established sucessfully');
});

async function selectQuery(sql, values) {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, function (err, result, fields) {
            if (err) reject(err);
            console.log("Selected from database");
            resolve(result);
        });
    });
}

// Function to fetch and insert data from CoinMarketCap API to MySQL database
function fetchAndInsertData() {
    // Create a MySQL connection
    const connection = mysql.createConnection(dbConfig);

    // Connect to the database
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err.message);
            return;
        }
        console.log('Connected to MySQL database');

        // Call the function to fetch and insert data
        insertData(connection);
    });
}
function insertQuery(sql, values) {
    connection.query(sql, values, function (err, result) {
        if (err) throw err;
        console.log("Number of records affected: " + result.affectedRows);
    });
}
// Function to insert data into the MySQL database
async function insertData(connection) {
    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'X-CMC_PRO_API_KEY': apiKey,
            },
            params: {
                start: 1,
                limit: 50,
            },
        });

        const { data } = response;
        const top50Cryptos = data.data;

        // Insert data into the MySQL database
        top50Cryptos.forEach(async (crypto) => {
            const query = `INSERT INTO cryptos (name, symbol, price, rank) VALUES (?, ?, ?, ?)`;
            const values = [crypto.name, crypto.symbol, crypto.quote.USD.price, crypto.cmc_rank];

            connection.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error inserting data into MySQL:', err.message);
                } else {
                    console.log(`Inserted ${crypto.name} into the database`);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching data:', error.message);
    } finally {
        // Close the MySQL connection when done
        connection.end();
    }
}

module.exports = {
    fetchAndInsertData,
    selectQuery,
    insertData,
    insertQuery,
};
