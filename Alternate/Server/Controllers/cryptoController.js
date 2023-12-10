const axios = require('axios');

const apiKey = 'ccbbd297-efee-408f-8a20-85e05ec55d66';
const apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
/*
async function viewDetail(req, res) {
  console.log("in the viewDetail");
  const id = req.params.index; // Use req.params to get the id parameter

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
      },
    });

    const json = response.data;
    const dataArray = json.data;
    //console.log(json); // Add this line to see the structure of the response
     console.log(typeof(dataArray));
     console.log(dataArray);
    // Check if json.data is defined and has the expected structure
    if (dataArray && dataArray[id]) {
      // Send the JSON response back to the client
      res.status(200).json({
        success: true,
        body: dataArray[id], // sends back the row of that particular id
      });
    } else {
      console.error('Invalid data structure:');
      res.status(500).json({
        success: false,
        message: 'Invalid data structure received from the API',
      });
    }
  } catch (error) {
    console.error('Error fetching crypto data:', error);

    // Send an error response back to the client
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching crypto data',
    });
  }
}
*/

async function viewDetail(req, res) {
  console.log("in the viewDetail");
  console.log(req.params);
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
      console.log(dataOb[i].name);
      console.log(id);
      if (dataOb[i].name === id) {
        correctCurrency = dataOb[i];
        console.log(correctCurrency);
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
};