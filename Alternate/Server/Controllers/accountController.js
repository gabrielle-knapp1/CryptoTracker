//here I will have functions to manipulate accounts 
const mysqls = require('../mysql');
const crypto = require('crypto');

//hashes passoword
const hashPassword = password => {
    return crypto.createHash('sha256').update(password).digest('hex').substring(0, 20);
};

//checks login features
async function checkLogin(req, res) {
    console.log("check login");
    const { username, password } = req.body;
    const rows = await mysqls.selectQuery("select username, password from account where username=?", [username]);
    let response = {
        loginValid: false,
        message: "Username not found"
    };
    if (rows.length === 0) {
        req.session.destroy();
        return res.send(response);
    } else if (rows.length = 1) {
        response.message = "Incorrect password";
        if (hashPassword(password) === rows[0].password) {
                response.loginValid = true;
                response.message = "Login successful";
                req.session.username = rows[0].username;
            }
        } else req.session.destroy();
    res.send(response);
}

//checks creating account
async function checkCreateAccount(req, res) {
    console.log("check create account");
    const { username, password } = req.body;
    let response = {
        createValid: false,
        message: ""
    };
    if (username === "" || password === "") {
        response.message = "Field cannot be empty";
        req.session.destroy();
        res.send(response);
        return;
    }
    const rows = await mysqls.selectQuery("select username, password from account where username=?", [username]);
    if (rows.length > 0) {
        response.message = "Username already exists";
        req.session.destroy();
        res.send(response);
        return;
    }
    response.createValid = true;
    response.message = "Account created";
    req.session.username = username;
    req.session.order = "des";
    mysqls.insertQuery("insert into account(username, password) values (?, ?)", [username, hashPassword(password)]);
    res.send(response);
}

//fetches account data from mysql
async function getAccount(req, res) {
    const username = req.session.username;
    if (!username) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const rows = await mysqls.selectQuery("select username, firstName, lastName, DOB, password from account where username=?", [username]);
    if (rows.length === 1) {
        res.send({ success: true, account: rows[0]});
    } else {
        res.send({ success: false });
    }
}

//updates account --> doesn't work right!!
function updateAccount(req, res) {
    try {
        const { username, firstname, lastname, DOB, password} = req.body;
        let sql = "update account set ";
        let values = [];
        if (username !== '') {
            sql += "username=?, ";
            values.push(username);
            req.session.username = username;
        }
        if (password !== '') {
            sql += "password=?, ";
            values.push(hashPassword(password));
        }
        if (firstName !== '') {
            sql += "firstName=?, ";
            values.push(firstName);
        }
        if (lastName !== '') {
            sql += "lastName=?, ";
            values.push(lastName);
        }
        if (DOB !== '') {
            sql += "DOB=?, ";
            values.push(DOB);
        }
        if (values.length == 0)
            return res.send({ success: false, message: "You must change at least one field." });
        sql = sql.slice(0, -2);
        sql += " where username=?";
        values.push(ogUsername);
        mysqls.insertQuery(sql, values)
        res.send({ success: true, message: "Account updated" });
    } catch {
        res.send({ success: false, message: "Unkown error" });
    }
}

//deletes account --> also works weird
function deleteCurrentAccount(req, res) {//to delete your own account
    try {
        const username = req.session.username;
        mysqls.insertQuery("delete from account where username=?", [username]);
        req.session.destroy();
        res.send({success: true, message: "Account deleted"});
    } catch {
        res.send({success: true, message: "Error during account deletion"});
    }
}

//logsout
function logout(req, res) {
    req.session.destroy();
    res.send({message: "Your are logged out"});
}

//gets session info
function getSession(req, res) {
    res.send({session: req.session});
}

//gets account info
async function getAccounts(req, res) {
    const rows = await mysqls.selectQuery("select username, firstName, lastName, DOB, password from account", []);
    res.send({ success: true, accounts: rows});
}

module.exports = {
    checkLogin,
    checkCreateAccount,
    getAccount,
    updateAccount,
    deleteCurrentAccount,
    logout,
    getSession,
    getAccounts
};