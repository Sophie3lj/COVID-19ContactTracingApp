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


router.post('/SignUp.html', function (req, res, next){
    req.pool.getConnection(function(err,connection){
        if(err){
            //res.sendStatus(500);
            return;
        }

        var reqBody = req.body;
        const first_name = reqBody.first_name;
		const last_name = reqBody.last_name;
		const email = reqBody.email;
		const phone_number = reqBody.phone_number;
		const street_number = reqBody.street_number;
		const stret_address = reqBody.street_address;
		const suburb = reqBody.suburb;
		const post_code = reqBody.post_code;
		const state = reqBody.state;
		const password = reqBody.password;
		var type = "";
		var id = 2;

		var queryString = '';
		if(suburb !== ""){
			type = "USER";
			queryString = `INSERT INTO accounts ( user_type, email, first_name, last_name, password_hash, phone_number) VALUES ('"+type+"', '"+email+"', '"+first_name+"', '"+last_name+"', '"+password+"', '"+phone_number+"')`;
		}
		connection.query(queryString, function(err, result){
			if(err){
				console.log("An error has occurred whilst posting new user information");
				console.log(err);
			}else {
				console.log("New user added to database");
			}
		});


    });
    res.redirect("/");
});


module.exports = router;
