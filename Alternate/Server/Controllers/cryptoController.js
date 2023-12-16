const axios = require('axios');

const apiKey = 'ccbbd297-efee-408f-8a20-85e05ec55d66';
const apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

//sort and get crypto tables
async function sortCrypto(req, res) {
  let order = req.session.order;
  const sortField = req.query.sortField;
  let isString = true;
  let isChanged = false;
  let isPrice = false;
  if (sortField === 'price' || sortField === 'quote.USD.percent_change_24h' || sortField === 'index') {
    if (sortField === 'quote.USD.percent_change_24h') {
      isChanged = true;
    }
    if (sortField === 'price') {
      isPrice = true;
    }
    console.log("changing isString, isString is now: ", isString);
    isString = false;
    console.log("isString is now: ", isString);
  }
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
      },
    });

    const json = response.data;
    const initial = json.data;
    const dataOb = json.data;

    let sortedData;

    //This works!
    //sorts name and symbol data
    if (order === "des") {
      //sorts descending data
      console.log(order);
      if (isString) {
        //console.log("Category is: ", sortField, "isString is: ", isString);

        sortedData = dataOb.sort((a, b) => {
          //console.log("Compared A: ",a);
          const valueA = a[sortField];
          const valueB = b[sortField];

          if (valueA === undefined || valueB === undefined) {
            // Handle the case where a[sortField] or b[sortField] is undefined
            return 0; // or any other default value
          }
          //THis is set up as descending A-Z
          return valueA.localeCompare(valueB);
        });
      }
      //This works!! 
      //sorts % change data
      else if (isChanged) {
        sortedData = dataOb.slice().sort((a, b) => {
          const valueA = parseFloat(a.quote.USD.percent_change_24h);
          const valueB = parseFloat(b.quote.USD.percent_change_24h);

          if (isNaN(valueA) || isNaN(valueB)) {
            // Handle the case where a.quote.USD[sortField] or b.quote.USD[sortField] is not a valid number
            console.log(a.quote.USD.percent_change_24h, " and ", b.quote.USD.percent_change_24h, " is not a valid number!"); // or any other default value
            return 0; // or another default behavior
          }
          //set up here as descending
          return valueB - valueA;
        });
      }
      //This works now
      //sorts price data
      else if (isPrice) {
        sortedData = dataOb.slice().sort((a, b) => {
          const valueA = parseFloat(a.quote.USD.price);
          //console.log("a price is :", a.quote.USD.price);
          const valueB = parseFloat(b.quote.USD.price);

          if (valueA === undefined || valueB === undefined) {
            // Handle the case where a[price] or b[price] is undefined
            console.log(a.quote.USD.price, " and ", b.quote.USD.price, " is undefined!"); // or any other default value
          }
          //console.log("percent changed", [a.quote.USD.percent_change_24h]);
          return valueB - valueA;
        });
      }
      else {
        sortedData = initial;
      }
      req.session.order = "asc";
    }
    else {
      //sorts ascending data
      console.log(order);
      if (isString) {
        //sorts name and symbol data
        sortedData = dataOb.sort((a, b) => {
          //console.log("Compared A: ",a);
          const valueA = a[sortField];
          const valueB = b[sortField];

          if (valueA === undefined || valueB === undefined) {
            // Handle the case where a[sortField] or b[sortField] is undefined
            return 0; // or any other default value
          }
          //THis is set up as descending A-Z
          return valueB.localeCompare(valueA);
        });
      }
      //This works!! 
      //sorts % changed data
      else if (isChanged) {
        sortedData = dataOb.slice().sort((a, b) => {
          const valueA = parseFloat(a.quote.USD.percent_change_24h);
          const valueB = parseFloat(b.quote.USD.percent_change_24h);

          if (isNaN(valueA) || isNaN(valueB)) {
            // Handle the case where a.quote.USD[sortField] or b.quote.USD[sortField] is not a valid number
            console.log(a.quote.USD.percent_change_24h, " and ", b.quote.USD.percent_change_24h, " is not a valid number!"); // or any other default value
            return 0; // or another default behavior
          }
          //set up here as descending
          return valueA - valueB;
        });
      }
      //This works now
      //sorts price data
      else if (isPrice) {
        sortedData = dataOb.slice().sort((a, b) => {
          const valueA = parseFloat(a.quote.USD.price);
          //console.log("a price is :", a.quote.USD.price);
          const valueB = parseFloat(b.quote.USD.price);

          if (valueA === undefined || valueB === undefined) {
            // Handle the case where a[price] or b[price] is undefined
            console.log(a.quote.USD.price, " and ", b.quote.USD.price, " is undefined!"); // or any other default value
          }
          //console.log("percent changed", [a.quote.USD.percent_change_24h]);
          return valueA - valueB;
        });
      }
      //Need to make this flipped
      //sorts index data
      else {
        sortedData = initial;
      }
      req.session.order = "des";
    }


    // Send the JSON response back to the client
    res.status(200).json({
      success: true,
      body: sortedData,
    });
  } catch (error) {
    console.error('Error sorting data:', error);

    // Send an error response back to the client
    res.status(500).json({
      success: false,
      message: 'An error occurred while sorting data',
    });
  }

}

//allows the popup of the detail
async function viewDetail(req, res) {
  console.log("in the viewDetail");
  //console.log("params for viewDetail", req.params);
  const id = req.params.id; // Use req.params to get the id parameter

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
      },
    });

    const json = response.data;
    const dataOb = json.data;
    let correctCurrency;

    for (let i = 0; i < dataOb.length; i++) {
      console.log("name of crypto where I am", dataOb[i].name);
      console.log("name of target crypto", id);
      if (dataOb[i].name === id) {
        correctCurrency = dataOb[i];
        //console.log(correctCurrency);
        break; // exit the loop once the correct currency is found
      }
    }

    // Send the JSON response back to the client
    res.status(200).json({
      success: true,
      body: correctCurrency, // sends back the row of that particular id
    });
  } catch (error) {
    console.error('Error fetching crypto data:', error);

    // Send an error response back to the client
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching crypto data',
    });
  }
}

//prints out the data
async function printCrypto(req, res) {
  console.log("in the printCrypto");
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
      },
    });

    const json = response.data;
    //console.log(json);

    // Send the JSON response back to the client
    res.status(200).json({
      success: true,
      body: json.data, // Assuming your cryptocurrency data is in the 'data' property of the response
    });
  } catch (error) {
    console.error('Error fetching crypto data:', error);

    // Send an error response back to the client
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching crypto data',
    });
  }
}

module.exports = {
  viewDetail,
  printCrypto,
  sortCrypto,
};