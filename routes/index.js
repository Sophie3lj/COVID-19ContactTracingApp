var express = require('express');
const bcrypt = require('bcrypt');
var router = express.Router();

var session;

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', { title: 'Express', });
});

router.get('/mapCheckins', function(req, res) {

    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }

        var query = "";
        var param = [];

        // check user type and change the query
        if('user_type' in req.session){
            if(req.session.user_type === "USER"){
                query = "SELECT checkins.date_time, venues.venue_name, venues.street_number, venues.street_name, suburbs.suburb_name, venues.postcode, venues.state, hotspots.id AS hotspot FROM checkins INNER JOIN venues ON checkins.venue_id = venues.id INNER JOIN suburbs ON suburbs.id = venues.suburb LEFT JOIN hotspots ON suburbs.id = hotspots.suburb_id WHERE checkins.user_id = ?"
                param.push(req.session.user_id);
            }
            else if(req.session.user_type === "ADMIN"){
                query = "SELECT checkins.date_time, venues.venue_name, venues.street_number, venues.street_name, suburbs.suburb_name, venues.postcode, venues.state, hotspots.id AS hotspot FROM checkins INNER JOIN venues ON checkins.venue_id = venues.id INNER JOIN suburbs ON suburbs.id = venues.suburb LEFT JOIN hotspots ON suburbs.id = hotspots.suburb_id" ;
            }
            else {
                res.sendStatus(404);
            }
        }
        else {
            res.sendStatus(404);
        }

        connection.query(query, param, function(err, rows, fields) {
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

        var query = "" ;

        // check user type and change the query
        if('user_type' in req.session){
            if(req.session.user_type === "USER"){
                query = "SELECT suburbs.suburb_name FROM hotspots INNER JOIN suburbs ON hotspots.suburb_id=suburbs.id" ;
            }
            else if(req.session.user_type === "ADMIN"){
                query = "SELECT 'ADMIN', hotspots.id, suburbs.suburb_name FROM hotspots INNER JOIN suburbs ON hotspots.suburb_id=suburbs.id" ;
                }
            else {
                res.sendStatus(404);
            }
        }
        else {
            res.sendStatus(404);
        }

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
            console.log(err);
            return;
        }

        var reqBody = req.body;
        var venue_name = reqBody.venue_name;
        var first_name = reqBody.first_name;
		var last_name = reqBody.last_name;
		var email = reqBody.email;
		var phone_number = reqBody.phone_number;
		var street_number = reqBody.street_number;
		var street_address = reqBody.street_address;
		var suburb = reqBody.suburb;
		var post_code = reqBody.post_code;
		var state = reqBody.state;
		var password = reqBody.password;
		var type = "";
		var id = 2;




		var queryString = '';
		if(suburb === ""){
			type = "USER";

		}else{
		    type = "VENUE"
		    first_name = "-";
		    last_name = "-";

		    //Get venue owner ID from user database
                var venue_owner;
                var venueString;
                console.log("no query");
                //get last ID from accounts
		        connection.query("select id FROM accounts ORDER BY ID DESC LIMIT 1", function(err, last_account_result){
		            if (err) console.log(err);
                    console.log("first query");
		            //Get suburb ID
    		        connection.query("select id from suburbs where suburbs.suburb_name = '"+suburb+"'", function(err, suburbs_result){
    		            if (err) console.log(err);
    		            console.log("second query");
    		            //Get last ID from suburbs
    		            connection.query("select id FROM suburbs ORDER BY ID DESC LIMIT 1", function(err, last_suburb_result){
    		                if (err) console.log(err);
                            console.log("third query");


    		            venue_owner = last_account_result[0].id +1;
		                console.log("venue owner ID: " + venue_owner);


    		            var suburb_id;
    		           //Check if suburb is in database
    		            if(suburbs_result[0] !== undefined){
                            suburb_id = suburbs_result[0].id;
    		            }else{
    		                suburb_id = last_suburb_result[0].id + 1;
    		                console.log("new suburb ID: " + suburb_id);
    		                //Create new suburb
                    		connection.query("INSERT INTO suburbs (suburb_name) VALUES ('"+suburb+"')", function(err, result){
                    			if(err){
                    			    console.log(err);
                    			}else{
                    			    console.log("New suburb created");
                    			}

                    		});
                        }

                        venueString = "INSERT INTO venues ( venue_name, venue_owner, street_number, street_name, suburb, postcode, state) VALUES ('"+venue_name+"', '"+venue_owner+"', '"+street_number+"', '"+street_address+"', '"+suburb_id+"', '"+post_code+"', '"+state+"')";
		                console.log(venueString);
                		connection.query(venueString, function(err, result){
                			if(err){
                			    console.log(err);
                			}else{
                			    console.log("New venue created")
                			}

                		});

    		            });
    		        });
		       });

		}

		bcrypt.genSalt(10, function(err, salt){
		    if(err) console.log(err);
		    bcrypt.hash(password, salt, function(err, hash){
		        if(err) console.log(err);
		        password = hash;
		        queryString = "INSERT INTO accounts ( user_type, email, first_name, last_name, password_hash, phone_number) VALUES ('"+type+"', '"+email+"', '"+first_name+"', '"+last_name+"', '"+password+"', '"+phone_number+"')";
		        connection.query(queryString, function(err, result){
        			if(err){
        				console.log(err);
        			}else {
        				console.log("New user created");
        			}
        		});
		        console.log(password);
		    });
		});



    });
    res.redirect("/");
});

router.post('/GoogleLogin.html', function(req,res,next){
    req.pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            return;
        }

        var body = req.body;
        var email = body.email;
        var first_name = body.first_name;
        var last_name = body.last_name;

        connection.query("select id, email, password_hash FROM accounts WHERE email='"+email+"'", function(err, result){
            if(err) console.log(err);
            if(result[0]===undefined){
                connection.query("INSERT INTO accounts ( user_type, email, first_name, last_name, password_hash, phone_number) VALUES ('USER', '"+email+"', '"+first_name+"', '"+last_name+"', '-', '-')", function(err, result){
                    if(err) console.log(err);
                    console.log("New google user created");
                });
            }
            req.session.email = email;
            res.redirect("/");
        });
    });
});


module.exports = router;
