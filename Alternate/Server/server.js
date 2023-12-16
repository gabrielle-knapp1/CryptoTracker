const express = require('express');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const uuid = require('uuid');
const path = require('path');
const app = express();
app.use(express.static('Alternate/Client/Public'));
const source = '/Alternate/Client/views';
const port = 1337;
app.use(express.static(path.join(__dirname, '..', 'Client', 'Public')));
app.use(cookieParser());
//session
app.use(session({
    genid: (req) => {
        return uuid.v4();
    },
    secret: "34VNJJjfhs7tYD7wwfsG49oae",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30, // session timeout: 30 minutes
        httpOnly: true,
        sameSite: 'strict',
    }
}));

//JSON Parser
const bodyParser = require('body-parser');
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Client permissions
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//users must login before going to a page directly
function requireLogin(req, res, next) {
    if (req.session && req.session.username) {
        return next();
    } else {
        return res.redirect('/');
    }
}

//views
app.get('/', function (req, res) {res.sendFile('index.html', {root: '../Client/views'})});
app.get('/index', function (req, res) {res.sendFile('index.html', {root: '../Client/views'})});
app.get('/account', function (req, res) {res.sendFile('account.html', {root: '../Client/views'})});
app.get('/home', function (req, res) {res.sendFile('listCurrencies.html', {root: '../Client/views'})});
app.get('/logout', function (req, res) {res.sendFile('logout.html', {root: '../Client/views'})});
app.get('/portfolio', function (req, res) {res.sendFile('portfolio.html', {root: '../Client/views'})});
//Didn't do one for detail bc that is a popup I believe

//Controllers
const accountController = require('./Controllers/accountController');
const cryptoController = require('./Controllers/cryptoController');
const portfolioController = require('./Controllers/portfolioController');

//routes
//account
app.route('/api/account/login').post(accountController.checkLogin);
app.route('/api/account/create').post(accountController.checkCreateAccount);
app.route('/api/account').get(accountController.getAccount);
app.route('/api/account').post(accountController.updateAccount);
app.route('/api/account').delete(accountController.deleteCurrentAccount);
app.route('/api/account/logout').post(accountController.logout);
app.route('/api/account/session').get(accountController.getSession);
app.route('/api/accounts').get(accountController.getAccounts);
//crypto
app.get('/api/crypto/get', cryptoController.printCrypto);
app.get('/api/crypto/detail/:id', function(req, res){
    console.log("in the detail request");
    cryptoController.viewDetail(req, res);
});
app.get('/api/crypto/get/sort', cryptoController.sortCrypto);
//portfolio
app.route('/api/portfolio/get').get(portfolioController.getPortfolio);
app.route('/api/portfolio/buy').post(portfolioController.buyCrypto);
app.route('/api/portfolio/sell').post(portfolioController.sellCrypto);
//sets them on a port
app.listen(port, () => {console.log(`Crypto Data Website listening on port ${port}`)});