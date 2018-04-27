var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const jquery = require('jquery');
/* GET home page. */
router.get('/', function(req, res, next) {

  var tinfo = ["No Track Queried"];
  res.render('QPBN', { title: 'Query Tracks' , tinfo : tinfo });

});

router.post('/', function(req, res, next) {
  var tinfo = ["No Track Selected"];
  var query ="";
  var iter = 0;
  let chinook = new sqlite3.Database('./database/chinook.db', (err) => {
    if (err)
    {
      return console.error(err.message);
    }
    console.log('Database Connection Successfully Established');
  });

  chinook.serialize(() => {
  chinook.each("SELECT name as tname, AlbumId as albumid, bytes as bsize, milliseconds as time FROM tracks WHERE tracks.name LIKE  '%" + req.body.tname.toString() + "%'", (err, row) => {
    if (err) { console.error(err.message);}
    tinfo[iter] = ("Name: " + row.tname + " | AlbumID: " + row.albumId + " | Size: " + (Number(row.bsize) / 1048576 ) + " Megabytes | Length: " + row.time + " Milliseconds");
    iter++;
  });

});
chinook.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close The Database Connection');
  res.render('QPBN', { title: 'Query Tracks', tinfo : tinfo });
  });
});
module.exports = router;
