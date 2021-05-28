var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/mapCheckins', function(req, res) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }

        var query = "SELECT checkins.date_time, venues.venue_name, venues.street_number, venues.street_name, suburbs.suburb_name, venues.postcode, venues.state FROM checkins INNER JOIN venues ON checkins.venue_id = venues.id INNER JOIN suburbs ON suburbs.id = venues.suburb" ;
        connection.query(query, function(err, rows, fields) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.json(rows);
        });
    });
});


router.get('/mapHotspots', function(req, res) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }

        var query = "SELECT suburb_name FROM suburbs WHERE hotspot_id IS NOT NULL" ;
        connection.query(query, function(err, rows, fields) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.json(rows);
        });
    });
});


module.exports = router;
