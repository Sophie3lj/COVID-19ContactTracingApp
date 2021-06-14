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
                query = "SELECT 'USER', checkins.date_time, checkins.lat, checkins.lng, venues.venue_name, venues.street_number, venues.street_name, suburbs.suburb_name, venues.postcode, venues.state, hotspots.id AS hotspot FROM checkins LEFT JOIN venues ON checkins.venue_id = venues.id LEFT JOIN suburbs ON suburbs.id = venues.suburb LEFT JOIN hotspots ON suburbs.id = hotspots.suburb_id WHERE checkins.user_id = ?";
                param.push(req.session.user_id);
            }
            else if(req.session.user_type === "ADMIN"){
                query = "SELECT 'ADMIN', checkins.date_time, checkins.lat, checkins.lng, accounts.first_name, accounts.last_name, venues.venue_name, venues.street_number, venues.street_name, suburbs.suburb_name, venues.postcode, venues.state, hotspots.id AS hotspot FROM checkins INNER JOIN accounts ON checkins.user_id = accounts.id INNER JOIN venues ON checkins.venue_id = venues.id INNER JOIN suburbs ON suburbs.id = venues.suburb LEFT JOIN hotspots ON suburbs.id = hotspots.suburb_id" ;
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

router.get('/MiniMapHotspots', function(req, res) {
    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var query = "SELECT suburbs.suburb_name FROM hotspots INNER JOIN suburbs ON hotspots.suburb_id=suburbs.id" ;
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

router.post('/createHotspot', function(req, res){
    req.pool.getConnection(function(err,connection){
        if (err) {
            res.sendStatus(500);
            return;
        }

        var query1 = "SELECT id FROM suburbs WHERE suburbs.suburb_name = ?";
        connection.query(query1, [req.body.suburb], function(err, rows, fields) {
            if (err) {
                res.sendStatus(500);
                return;
            }

            var suburb_id;

            if(rows[0] !== undefined){
                suburb_id = rows[0].id;
            }
            else{
                var query2 = "INSERT INTO suburbs (suburb_name) VALUES (?)";
                connection.query(query2, [req.body.suburb], function(err, rows, fields) {
                    if (err) {
                        res.sendStatus(500);
                        return;
                    }
                });

            }

            var query3 = "INSERT INTO hotspots (suburb_id) VALUES (?)";
            connection.query(query3, [suburb_id], function(err, rows, fields) {
                connection.release();
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                res.end();
            });
        });

    });
});

router.post('/deleteHotspot', function(req, res){
    req.pool.getConnection(function(err,connection){
        if (err) {
            res.sendStatus(500);
            return;
        }

        var query1 = "DELETE FROM hotspots WHERE id = ?";
        connection.query(query1, [req.body.hotspot_id], function(err, rows, fields) {
            if (err) {
                res.sendStatus(500);
                return;
            }

            res.end();

        });

    });
});

router.post('/SignUp', function (req, res, next){
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
	var type = "USER";
	var id = 2;
	var venueid = 1;
	var venue_owner;
    var venueString;
    var suburb_id;

    req.pool.getConnection(function(err,connection){
        if(err){
            console.log(err);
            return;
        }

		var queryString = '';

		bcrypt.genSalt(10, function(err, salt){
        if(err){
            console.log(err);
        }
        bcrypt.hash(password, salt, function(err, hash){
            if(err){
                console.log(err);
            }
            password = hash;

            if(suburb === ""){
                type = "USER";
            }else{
                type = "VENUE";
            }

            queryString = "INSERT INTO accounts ( user_type, email, first_name, last_name, password_hash, phone_number) VALUES (?, ?, ?, ?, ?, ?)";
            connection.query(queryString,[type,email,first_name,last_name,password,phone_number], function(err, result){
                if(err){
                    console.log(err);
                }else {
                    console.log("New user created");
                    connection.query("select id FROM accounts ORDER BY ID DESC LIMIT 1", function(err, last_account_result){
                        if(err){
                            console.log(err);
                        }
                        id = last_account_result[0].id;
                    });
                }
                if(suburb === ""){
                    type = "USER";

                }else{
                    type = "VENUE";
                    first_name = "-";
                    last_name = "-";

                    //update venue type

                    //Get venue owner ID from user database

                    console.log("no query");
                    //get last ID from accounts
                    connection.query("select id FROM accounts ORDER BY ID DESC LIMIT 1", function(err, last_account_result){
                        if(err){
                            console.log(err);
                        }
                        console.log("first query");

                        //Get suburb ID
                        connection.query("select id from suburbs where suburbs.suburb_name = ?",[suburb], function(err, suburbs_result){
                            if (err){
                                console.log(err);
                            }
                            console.log("second query");
                            //Get last ID from suburbs
                            connection.query("select id FROM suburbs ORDER BY ID DESC LIMIT 1", function(err, last_suburb_result){
                                if (err){
                                    console.log(err);
                                }
                                console.log("third query");

                                venue_owner = last_account_result[0].id;
                                console.log("venue owner ID: " + venue_owner);
                                //Check if suburb is in database
                                if(suburbs_result[0] !== undefined){
                                    suburb_id = suburbs_result[0].id;
                                }else{
                                    suburb_id = last_suburb_result[0].id + 1;
                                    console.log("new suburb ID: " + suburb_id);
                                    //Create new suburb
                                    connection.query("INSERT INTO suburbs (suburb_name) VALUES (?)",[suburb], function(err, result){
                                        if(err){
                                            console.log(err);
                                        }else{
                                            console.log("New suburb created");
                                        }
                                    });
                                }

                                venueString = "INSERT INTO venues ( venue_name, venue_owner, street_number, street_name, suburb, postcode, state) VALUES (?,?,?,?,?,?,?)";
                                console.log(venueString);
                                connection.query(venueString,[venue_name,venue_owner,street_number,street_address,suburb_id,post_code,state], function(err, result){
                                    if(err){
                                        console.log(err);
                                    }else{
                                        console.log("New venue created");
                                    }
                                });
                            });
                            connection.query("SELECT id FROM venues ORDER BY id DESC LIMIT 1", function(err, last_account_result){
                                if(err){
                                    console.log(err);
                                }else{
                                    venueid = last_account_result[0].id;
                                }
                            });
                        });
                    });
                }
                req.session.email = email;
                req.session.user_type = type;

                if(type !== 'VENUE'){
                    req.session.user_id = id;
                    req.session.user_name = first_name + ' ' + last_name;
                }
                else{
                    req.session.user_id = id;
                    req.session.venue_id = venueid;
                    req.session.user_name = venue_name;
                }
                res.redirect("/");
                });
            });
		});
	});
});



router.post('/newadmin', function (req, res, next){
    req.pool.getConnection(function(err,connection){
        if(err){
            console.log(err);
            return;
        }

        var reqBody = req.body;
        var first_name = reqBody.first_name;
		var last_name = reqBody.last_name;
		var email = reqBody.email;
		var phone_number = reqBody.phone_number;
		var password = reqBody.password;
		var type = "ADMIN";

		var queryString = '';

		bcrypt.genSalt(10, function(err, salt){
            if(err){
                console.log(err);
            }
            bcrypt.hash(password, salt, function(err, hash){
                if(err){
                    console.log(err);
                }
                password = hash;
                queryString = "INSERT INTO accounts ( user_type, email, first_name, last_name, password_hash, phone_number) VALUES (?, ?, ?, ?, ?, ?)";
                connection.query(queryString, [type, email, first_name, last_name, password, phone_number], function(err, result){
                    if(err){
                        console.log(err);
                    }else {
                        console.log("New user created");
                    }
                });
                //console.log(password);
            });
        });
    });
    res.redirect("/");
});

router.post('/editAccDetails', function (req, res, next){

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
		var id = req.session.user_id;
		var type = req.session.user_type;

		var queryString = '';

        if (!(first_name === '')){
            queryString = "UPDATE accounts SET first_name = ? WHERE id = ?";
            connection.query(queryString, [first_name, id], function(err, result){
                if(err){
                    console.log(err);
                }else {
                    console.log("First Name Successfully Updated");
                }
            });
        }

        if (!(last_name === '')){
            queryString = "UPDATE accounts SET last_name = ? WHERE id = ?";
            connection.query(queryString, [last_name, id], function(err, result){
                if(err){
                    console.log(err);
                }else {
                    console.log("Last Name Successfully Updated");
                }
            });
        }

        if (!(email === '')){
            queryString = "UPDATE accounts SET email = ? WHERE id = ?";
            connection.query(queryString, [email, id], function(err, result){
                if(err){
                    console.log(err);
                }else {
                    console.log("Email Successfully Updated");
                }
            });
        }

        if (!(phone_number === '')){
            queryString = "UPDATE accounts SET phone_number = ? WHERE id = ?";
            connection.query(queryString, [phone_number, id], function(err, result){
                if(err){
                    console.log(err);
                }else {
                    console.log("Phone Number Successfully Updated");
                }
            });
        }

        if (!(password === '')){
            bcrypt.genSalt(10, function(err, salt){
                if(err){
                    console.log(err);
                }
                bcrypt.hash(password, salt, function(err, hash){
                    if(err){
                        console.log(err);
                    }
                    password = hash;
                    queryString = "UPDATE accounts SET password_hash = ? WHERE id = ?";
                    connection.query(queryString, [password, id], function(err, result){
                        if(err){
                            console.log(err);
                        }else {
                            console.log("Password Successfully Updated");
                        }
                    });
                    //console.log(password);
                });
            });
        }

        //street_number, street_address, suburb, post_code, state

        if (type === "VENUE"){
            if (!(street_number === '')){
                queryString = "UPDATE venues SET street_number = ? WHERE venue_owner = ?";
                connection.query(queryString, [street_number, id], function(err, result){
                    if(err){
                        console.log(err);
                    }else {
                        console.log("Street Number Successfully Updated");
                    }
                });
            }

            if (!(street_address === '')){
                queryString = "UPDATE venues SET street_name = ? WHERE venue_owner = ?";
                connection.query(queryString, [street_address, id], function(err, result){
                    if(err){
                        console.log(err);
                    }else {
                        console.log("Street Name Successfully Updated");
                    }
                });
            }

            if (!(suburb === '')){
                queryString = "UPDATE venues SET suburb = ? WHERE venue_owner = ?";
                connection.query(queryString, [suburb, id], function(err, result){
                    if(err){
                        console.log(err);
                    }else {
                        console.log("Suburb Successfully Updated");
                    }
                });
            }

            if (!(post_code === '')){
                queryString = "UPDATE venues SET postcode = ? WHERE venue_owner = ?";
                connection.query(queryString, [post_code, id], function(err, result){
                    if(err){
                        console.log(err);
                    }else {
                        console.log("Postcode Successfully Updated");
                    }
                });
            }

            if (!(state === '')){
                queryString = "UPDATE venues SET state = ? WHERE venue_owner = ?";
                connection.query(queryString, [state, id], function(err, result){
                    if(err){
                        console.log(err);
                    }else {
                        console.log("State Successfully Updated");
                    }
                });
            }
        }
    });
    res.redirect("/users/AccountDetails");
});

module.exports = router;
