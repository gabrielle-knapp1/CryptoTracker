Project Name: CryptoCurrency Tracker
Gabrielle Knapp
Sophomore, Computer Science Major, Marist College

**Languages Used**: Javascript (primary), HTML, CSS, SQL
**Organization**:
Alternate
  Client
    Public
      css
        account.css
        index.css
        listCurrencies.css
        logout.css
        portfolio.css
      js
        account.js
        index.js
        listCurrencies.js
        logout.js
        portfolio.js
      images
        bitcoin.jpg
    views
      account.html
      index.html
      listCurrencies.html
      logout.html
      portfolio.html
  Server
    mysql.js
    server.js
    Controllers
      portfolioController.js
      accountController.js
      cryptoController.js

**Description**:
The **realtime data**, presented in the ‘listCurrencies.html’ file, updates every time you refresh the page
To **sort** the data of the live cryptocurrency tracker, you can click the column label button, and every time you click it it switches the order of how it is sorted, from ascending to descending
To view the **details** about each cryptocurrency you can click the number button in the first column of each row, and the detail will pop up after the alert box
The **buy** functionality works when you click “buy” and that is displayed in the portfolio page.  You can also **sell** the cryptos from the portfolio.  
You can see the portfolio when you log in and logout, it is maintained.
You can **logout** of the application via the logout page
The **mysql** files consist of three tables: portfolio, account, and transaction.  These store everything needed for this project.  Portfolio carries what everyone owns currently, transaction carries what everyone bought everything for, and account carries everyone’s account information.
