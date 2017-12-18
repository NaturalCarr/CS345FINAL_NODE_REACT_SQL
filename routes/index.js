var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const jquery = require('jquery');
/* GET home page. */
router.get('/', function(req, res, next) {

res.render('login', {title: 'Login Page'});
});

router.post('/', function(req, res, next) {
  var temp = "";
  var logreg = req.body.logreg;
  var usn = req.body.username;
  var usp = req.body.password;
  console.log(usn + " " + usp);
  let chinook = new sqlite3.Database('./database/chinook.db', (err) => {
    if (err)
    {
      return console.error(err.message);
    }
    console.log('Database Connection Successfully Established');
  });
  chinook.serialize(() => {
    if (logreg == "Register") {
      chinook.run("INSERT INTO credentials (username, password) VALUES ('" + usn + "','" + usp + "')");
    }
    else if (logreg == "Login"){
      chinook.each("SELECT password as pswd FROM credentials where username='" + usn + "'", function(err, row) {
        if (err) {return console.err(err.message);}
        temp = row.pswd;
      });
    }
  });
  chinook.close((err) => {
    if (err) { return console.error(err.message); }
    if (logreg == "Login"){
    if (temp == null || temp === '0' || temp == [] || temp == "" || temp === null) {
      console.log ('Failed Login Attempt | UN: ' + usn + 'UP: ' + usp);
      res.status(401);
      res.send('Invalid Username and/or Password, Login Attempt Logged');
    }
    else if (usp == temp) {
      res.render('index', { title: 'CS309 Final Project' });
    }
    else {
      console.log ('Failed Login Attempt | Username: ' + usn + ' Password: ' + usp);
      res.status(401);
      res.send('Invalid Username and/or Password, Login Attempt Logged');
    }
  }
    console.log('Close The Database Connection');
    });
});

function callback(row){ temp = row; }
module.exports = router;
