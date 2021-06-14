var express = require('express');
const bcrypt = require('bcrypt');
var router = express.Router();

//var session;

/* GET home page. */
router.get('/', function(req, res) {
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
                query = "SELECT 'ADMIN', checkins.date_time, checkins.lat, checkins.lng, accounts.first_name, accounts.last_name, venues.venue_name, venues.street_number, venues.street_name, suburbs.suburb_name, venues.postcode, venues.state, hotspots.id AS hotspot FROM checkins LEFT JOIN accounts ON checkins.user_id = accounts.id LEFT JOIN venues ON checkins.venue_id = venues.id LEFT JOIN suburbs ON suburbs.id = venues.suburb LEFT JOIN hotspots ON suburbs.id = hotspots.suburb_id" ;
            }
            else {
                res.sendStatus(404);
            }
        }
        else {
            res.sendStatus(404);
        }

        connection.query(query, param, function(err, rows) {
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

        connection.query(query, function(err, rows) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }

            if (rows[0] === undefined && req.session.user_type === "ADMIN"){
                console.log('no row');
                rows = {
                    admin: true
                };
                console.log(rows.admin);
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
        connection.query(query, function(err, rows) {
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
        connection.query(query1, [req.body.suburb], function(err, rows) {
            if (err) {
                res.sendStatus(500);
                return;
            }

            var suburb_id;

            if(rows[0] !== undefined){
                suburb_id = rows[0].id;

                var query3 = "INSERT INTO hotspots (suburb_id) VALUES (?)";
                connection.query(query3, [suburb_id], function(err) {
                    connection.release();
                    if (err) {
                        res.sendStatus(500);
                        return;
                    }
                    res.end();
                });
            }
            else{
                var query2 = "INSERT INTO suburbs (suburb_name) VALUES (?)";
                connection.query(query2, [req.body.suburb], function(err) {
                    if (err) {
                        res.sendStatus(500);
                        return;
                    }
                    var query4 = "SELECT id FROM suburbs WHERE suburbs.suburb_name = ?";
                    connection.query(query4, [req.body.suburb], function(err, rows2) {
                        if (err) {
                            res.sendStatus(500);
                            return;
                        }
                        suburb_id = rows2[0].id;

                        var query5 = "INSERT INTO hotspots (suburb_id) VALUES (?)";
                        connection.query(query5, [suburb_id], function(err) {
                            connection.release();
                            if (err) {
                                res.sendStatus(500);
                                return;
                            }
                            res.end();
                        });
                    });
                });
            }
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
        connection.query(query1, [req.body.hotspot_id], function(err) {
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.end();
        });
    });
});

router.post('/signup', function (req, res, next){

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

	var type = reqBody.user_type;
	var id ;
	var venueid ;
	var venue_owner;
    var venueString;
    var suburb_id;

    req.pool.getConnection(function(err,connection){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        }

        connection.query("SELECT * FROM accounts WHERE email = ?", [email], function(err, existing_user_check){
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            }

           if (existing_user_check[0] !== undefined){
                res.sendStatus(401);
                return;
            } else {

		var queryString = '';

		bcrypt.genSalt(10, function(err, salt){
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            }
            bcrypt.hash(password, salt, function(err, hash){
                if(err){
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
                password = hash;

                queryString = "INSERT INTO accounts ( user_type, email, first_name, last_name, password_hash, phone_number) VALUES (?, ?, ?, ?, ?, ?)";
                connection.query(queryString,[type,email,first_name,last_name,password,phone_number], function(err, result){
                    if(err){
                        console.log(err);
                        res.sendStatus(400);
                        return;
                    }
                    else {

                        if (type === 'VENUE'){
                            //Get suburb ID
                            connection.query("select id from suburbs where suburbs.suburb_name = ?",[suburb], function(err, suburbs_result){
                                if (err){
                                    console.log(err);
                                    res.sendStatus(500);
                                    return;
                                }
                                //Get last ID from suburbs
                                connection.query("select id FROM suburbs ORDER BY ID DESC LIMIT 1", function(err, last_suburb_result){
                                    if (err){
                                        console.log(err);
                                        res.sendStatus(500);
                                        return;
                                    }
                                    //Check if suburb is in database
                                    if(suburbs_result[0] !== undefined){
                                        suburb_id = suburbs_result[0].id;
                                    }
                                    else {
                                        if (last_suburb_result[0] !== undefined){
                                            suburb_id = last_suburb_result[0].id + 1;
                                        }
                                        else{
                                            suburb_id = 1 ;
                                        }
                                            console.log("new suburb ID: " + suburb_id);
                                        //Create new suburb
                                        connection.query("INSERT INTO suburbs (suburb_name) VALUES (?)",[suburb], function(err, result){
                                            if(err){
                                                console.log(err);
                                                res.sendStatus(500);
                                            }
                                        });
                                    }

                                    venueString = "INSERT INTO venues ( venue_name, venue_owner, street_number, street_name, suburb, postcode, state) VALUES (?,?,?,?,?,?,?)";
                                    //console.log(venueString);
                                    connection.query(venueString,[venue_name,id,street_number,street_address,suburb_id,post_code,state], function(err, result){
                                        if(err){
                                            console.log(err);
                                            res.sendStatus(400);
                                            return;
                                        }
                                    });
                                });

                                connection.query("SELECT id FROM venues ORDER BY id DESC LIMIT 1", function(err, last_account_result){

                                    if(err){
                                        console.log(err);
                                        res.sendStatus(500);
                                        return;
                                    }else{
                                        if (last_account_result[0] !== undefined){
                                            venueid = last_account_result[0].id;
                                        }
                                        else{
                                            venueid = 100000 ;
                                        }
                                    }
                                });
                            });
                        }

                        console.log("New user created");
                        connection.query("select id FROM accounts ORDER BY ID DESC LIMIT 1", function(err, last_account_result){
                            if(err){
                                console.log(err);
                                res.sendStatus(500);
                                return;
                            }
                            id = last_account_result[0].id;
                        });
                    }
                });
            });
		});
                if (type === "VENUE"){
                    req.session.venue_id = venueid;
                    req.session.user_name = venue_name;
                    req.session.user_id = id;
                    req.session.email = email;
                    req.session.user_type = type;
                    res.send();
                } else {
                    req.session.user_id = id;
                    req.session.email = email;
                    req.session.user_type = type;
                    req.session.user_name = first_name + ' ' + last_name;
                    res.send();
                }
            }
        });

	});
});



router.post('/newadmin', function (req, res){
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
		var id ;

		connection.query("SELECT * FROM accounts WHERE email = ?", [email], function(err, existing_user_check){
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            }

           if (existing_user_check[0] !== undefined){
                console.log('existing_user_check');
                res.sendStatus(401);
                return;
            } else {

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
                        connection.query(queryString, [type, email, first_name, last_name, password, phone_number], function(err){
                            if(err){
                                console.log(err);
                                res.sendStatus(500);
                                return;
                            }else {
                                console.log("New admin created");
                                connection.query("select id FROM accounts ORDER BY ID DESC LIMIT 1", function(err, last_account_result){
                                    if(err){
                                        console.log(err);
                                        res.sendStatus(500);
                                        return;
                                    }
                                    id = last_account_result[0].id;
                                });
                            }
                        });
                    });
                });

                res.send();
            }
		});
    });
});

router.post('/editAccDetails', function (req, res){

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
            connection.query(queryString, [first_name, id], function(err){
                if(err){
                    console.log(err);
                }
            });
        }

        if (!(last_name === '')){
            queryString = "UPDATE accounts SET last_name = ? WHERE id = ?";
            connection.query(queryString, [last_name, id], function(err){
                if(err){
                    console.log(err);
                }
            });
        }

        if (!(email === '')){
            queryString = "UPDATE accounts SET email = ? WHERE id = ?";
            connection.query(queryString, [email, id], function(err){
                if(err){
                    console.log(err);
                }
            });
        }

        if (!(phone_number === '')){
            queryString = "UPDATE accounts SET phone_number = ? WHERE id = ?";
            connection.query(queryString, [phone_number, id], function(err){
                if(err){
                    console.log(err);
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
                    connection.query(queryString, [password, id], function(err){
                        if(err){
                            console.log(err);
                        }
                    });
                });
            });
        }

        //street_number, street_address, suburb, post_code, state

        if (type === "VENUE"){
            if (!(street_number === '')){
                queryString = "UPDATE venues SET street_number = ? WHERE venue_owner = ?";
                connection.query(queryString, [street_number, id], function(err){
                    if(err){
                        console.log(err);
                    }
                });
            }

            if (!(street_address === '')){
                queryString = "UPDATE venues SET street_name = ? WHERE venue_owner = ?";
                connection.query(queryString, [street_address, id], function(err){
                    if(err){
                        console.log(err);
                    }
                });
            }

            if (!(suburb === '')){

                connection.query("SELECT id FROM suburbs WHERE suburbs.suburb_name = ?",[suburb], function(err, suburbs_result){
                    if (err){
                        console.log(err);
                    }

                    //Get last ID from suburbs
                    connection.query("SELECT id FROM suburbs ORDER BY ID DESC LIMIT 1", function(err, last_suburb_result){
                        if (err){
                            console.log(err);
                        }

                        var suburb_id;
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
                                }
                            });
                        }

                        queryString = "UPDATE venues SET suburb = ? WHERE venue_owner = ?";
                        connection.query(queryString, [suburb_id, id], function(err, result){
                            if(err){
                                console.log(err);
                            }
                        });
                    });
                });
            }

            if (!(post_code === '')){
                queryString = "UPDATE venues SET postcode = ? WHERE venue_owner = ?";
                connection.query(queryString, [post_code, id], function(err){
                    if(err){
                        console.log(err);
                    }
                });
            }

            if (!(state === '')){
                queryString = "UPDATE venues SET state = ? WHERE venue_owner = ?";
                connection.query(queryString, [state, id], function(err){
                    if(err){
                        console.log(err);
                    }
                });
            }
        }
    });
    res.redirect("/users/AccountDetails");
});

module.exports = router;
