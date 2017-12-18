var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const jquery = require('jquery');
/* GET home page. */
router.get('/', function(req, res, next) {
  var trackl = ["No Playlist Selected"];
  var playlists = [];
  var iter = 0;
  let chinook = new sqlite3.Database('./database/chinook.db', (err) => {
    if (err)
    {
      return console.error(err.message);
    }
    console.log('Database Connection Successfully Established');
  });

  chinook.serialize(() => {
    chinook.each(`SELECT PlaylistId as id, Name as name FROM playlists`, (err, row) => {
      if (err) { console.error(err.message);}
      playlists[iter] = ("ID - " + row.id.toString() + " | " + row.name.toString());
      //console.log(row.id + "\t" + row.name);
      iter++;
    });

  });
  chinook.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close The Database Connection');
    res.render('QTBP', {plist : playlists , tlist : trackl});
  });

});
router.post('/', function (req, res, next) {
  var playlists = [];
  var iter=0;
  var iter2 = 0;
  var trackl = [];
  var querya = Number(req.body.selection);
  let chinook = new sqlite3.Database('./database/chinook.db', (err) => {
    if (err)
    {
      return console.error(err.message);
    }
    console.log('Database Connection Successfully Established')
  });
  chinook.serialize(() => {
    chinook.each(`SELECT PlaylistId as id, Name as name FROM playlists`, (err, row) => {
      if (err) { console.error(err.message);}
      playlists[iter] = ("ID - " + row.id.toString() + " | " + row.name.toString());
      //console.log(row.id + "\t" + row.name);
      iter++;
    });
    chinook.each("SELECT tracks.Name as name FROM tracks, playlists, playlist_track WHERE tracks.Trackid = playlist_track.Trackid AND playlist_track.playlistid = playlists.playlistid AND Playlists.playlistID = '" + querya + "'", (err, row) => {
      if (err) { console.error(err.message);}
      trackl[iter2] = row.name.toString();
      iter2++;
    });

  });
  chinook.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close The Database Connection');
    res.render('QTBP', {plist : playlists , tlist : trackl});
  });
});
module.exports = router;
