var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const jquery = require('jquery');
/* GET home page. */
router.get('/', function(req, res, next) {

  var cinfo = ["No Customer ID Queried"];
  res.render('QCBC', { title: 'Query Customers' , cinfo : cinfo });

});

router.post('/', function(req, res, next) {
  var iter=0;
  var cinfo = ["No CustomerID Selected"];
  var cid = Number(req.body.customerid);
  var query ="SELECT DISTINCT Customers.firstname as fname, customers.lastname as lname, genres.name as gname, COUNT(genres.name) as gcount FROM invoices, genres, invoice_items, tracks, customers WHERE invoices.customerid=customers.customerid AND invoices.invoiceid=invoice_items.invoiceid AND invoice_items.trackid=tracks.trackid AND tracks.genreid=genres.genreid AND customers.customerid= '"
  let chinook = new sqlite3.Database('./database/chinook.db', (err) => {
    if (err)
    {
      return console.error(err.message);
    }
    console.log('Database Connection Successfully Established')
  });

  chinook.serialize(() => {
  chinook.each(query + cid + "' GROUP BY genres.name" , (err, row) => {
    if (err) { console.error(err.message);}
    cinfo[iter] = ("Name: " + row.fname + " " + row.lname + " | Genre:" + row.gname + " [" + row.gcount + "]" );
    iter++;
  });

});
chinook.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close The Database Connection');
  res.render('QCBC', { title: 'Query Customers', cinfo : cinfo });
  });
});

module.exports = router;
