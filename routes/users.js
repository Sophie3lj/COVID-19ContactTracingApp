var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});

router.post('/login', function(req,res){

    var bcrypt = require('bcrypt');
    //get connection
    //console.log("attempted login");
    //console.log(req.body.email) ;
    req.pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        }

        connection.query("SELECT accounts.id, accounts.email, accounts.password_hash, accounts.user_type, accounts.first_name, accounts.last_name, venues.id AS venue_id, venues.venue_name FROM accounts LEFT JOIN venues ON accounts.id = venues.venue_owner WHERE email = ?", [req.body.email], function(err, result){
            if(err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }

            //Email is incorrect
            if(result[0] === undefined){
                res.sendStatus(401);
                return;
            }

            bcrypt.compare(req.body.password, result[0].password_hash, function(err, password_result){
                if(err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }

                if(password_result == true){
                    req.session.email = result[0].email;
                    req.session.user_type = result[0].user_type;

                    if(result[0].user_type !== 'VENUE'){
                        req.session.user_id = result[0].id;
                        req.session.user_name = result[0].first_name + ' ' + result[0].last_name;
                    }
                    else{
                        req.session.user_id = result[0].id;
                        req.session.venue_id = result[0].venue_id;
                        req.session.user_name = result[0].venue_name;
                    }

                    res.send(result[0].user_type);
                }else{

                    res.sendStatus(401);
                }

            });
        });
    });

});

router.post('/GoogleLogin', function(req,res){
    req.pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            return;
        }
        console.log("Google login");
        var body = req.body;
        var email = body.email;
        var first_name = body.first_name;
        var last_name = body.last_name;
        if(first_name=="undefined"){
            first_name = " ";
        }
        if(last_name=="undefined"){
            last_name=" ";
        }
        connection.query("select id, email, password_hash FROM accounts WHERE email= ?",[email], function(err, result){
            if(err) console.log(err);
            if(result[0]===undefined){
                connection.query("INSERT INTO accounts ( user_type, email, first_name, last_name, password_hash, phone_number) VALUES ('USER', ?,?,?, '-', '-')",[email,first_name,last_name], function(err){
                    if(err) console.log(err);
                    console.log("New google user created");
                });
            }else{
                req.session.user_id = result[0].id;
            }

            req.session.email = email;
            req.session.user_type = "USER";

            req.session.user_name = first_name + ' ' + last_name;
            console.log('session set');
            console.log(req.session.email + ', ' + req.session.user_name);
            res.send(result[0].user_type);

        });
    });
});

router.get('/LoginCheck', function(req, res){
    let login = {
		user_type: '',
		user_name: ''
	};

    if('user_type' in req.session){
        login.user_type = req.session.user_type;
        login.user_name = req.session.user_name;
    }

    res.json(login);
});

router.use(function(req, res, next) {
    if('email' in req.session){
        next();
    }
    else {
        res.sendStatus(401);
    }
});

router.get('/CheckinCheck', function(req, res){
    if('user_type' in req.session){
        if(req.session.user_type === "USER"){
            res.redirect('/users/Checkin');
        }
        else {
            res.sendStatus(401);
        }
    }
    else {
        res.sendStatus(401);
    }
});

router.get('/MapCheck', function(req, res){
    if('user_type' in req.session){
        if(req.session.user_type === "USER"){
            res.redirect('/users/Map');
        }
        else if(req.session.user_type === "ADMIN"){
            res.redirect('/users/Map');
        }
        else {
            res.sendStatus(401);
        }
    }
    else {
        res.sendStatus(401);
    }
});

router.post('/logout', function(req, res) {
    delete req.session.email;
    delete req.session.user_type;
    delete req.session.user_id;
    delete req.session.user_name;
    res.end();
});

/* Query database for AccountDetails.html !!NEED SESSION CODE!! */
router.get('/getAccountDetails', function(req, res) {
    req.pool.getConnection( function(err, connection) {
        if (err) {
            res.sendStatus(500);
            return;

        }
        var user_id = req.session.user_id;
        var query;
        /* Query to get all neccessary data */
        if (req.session.user_type === "USER") {
            query = "SELECT accounts.first_name, accounts.last_name, accounts.email, accounts.phone_number FROM accounts WHERE accounts.id = ?";
            console.log('type USER details');
        }
        else if (req.session.user_type === "ADMIN") {
            query = "SELECT accounts.first_name, accounts.last_name, accounts.email, accounts.phone_number FROM accounts WHERE accounts.id = ?";
            console.log('type ADMIN details');
        }
        else if (req.session.user_type === "VENUE") {
            query = "SELECT accounts.first_name, accounts.last_name, accounts.email, accounts.phone_number, venues.venue_name, venues.street_number, venues.street_name,  venues.postcode, venues.state, suburbs.suburb_name FROM ((accounts INNER JOIN venues ON accounts.id = venues.venue_owner) INNER JOIN suburbs ON venues.suburb = suburbs.id) WHERE accounts.id = ?";
            console.log('type VENUE details');
        }
        connection.query(query, [user_id], function(err, rows) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;

            }
            console.log(rows[0].first_name);
            console.log('query successful');
            res.json(rows);

        });
    });
});

router.get('/getCheckinHistory', function(req, res) {

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
                query = "SELECT 'USER', checkins.date_time, checkins.lat, checkins.lng, venues.venue_name, suburbs.suburb_name, hotspots.id AS hotspot FROM checkins LEFT JOIN venues ON checkins.venue_id = venues.id LEFT JOIN suburbs ON suburbs.id = venues.suburb LEFT JOIN hotspots ON suburbs.id = hotspots.suburb_id WHERE checkins.user_id = ?";
                param.push(req.session.user_id);
            }
            else if(req.session.user_type === "ADMIN"){
                query = "SELECT 'ADMIN', checkins.date_time, checkins.lat, checkins.lng, checkins.user_id, venues.venue_name, suburbs.suburb_name, hotspots.id AS hotspot FROM checkins LEFT JOIN venues ON checkins.venue_id = venues.id LEFT JOIN suburbs ON suburbs.id = venues.suburb LEFT JOIN hotspots ON suburbs.id = hotspots.suburb_id" ;
            }
            else if(req.session.user_type === "VENUE"){
                query = "SELECT 'VENUE', checkins.date_time, checkins.user_id, hotspots.id AS hotspot FROM checkins LEFT JOIN venues ON checkins.venue_id = venues.id LEFT JOIN suburbs ON suburbs.id = venues.suburb LEFT JOIN hotspots ON suburbs.id = hotspots.suburb_id WHERE checkins.venue_id = ?" ;
                param.push(req.session.venue_id);
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

router.post('/getCheckinSearchHistory', function(req, res) {

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
                query = "SELECT 'USER', checkins.date_time, venues.venue_name, suburbs.suburb_name, hotspots.id AS hotspot FROM checkins INNER JOIN venues ON checkins.venue_id = venues.id INNER JOIN suburbs ON suburbs.id = venues.suburb LEFT JOIN hotspots ON suburbs.id = hotspots.suburb_id WHERE checkins.user_id = ? AND (venues.venue_name = ?)";
                param.push(req.session.user_id);
                param.push(req.body.search);
            }
            else if(req.session.user_type === "ADMIN"){
                query = "SELECT 'ADMIN', checkins.date_time, checkins.user_id, venues.venue_name, suburbs.suburb_name, hotspots.id AS hotspot FROM checkins INNER JOIN venues ON checkins.venue_id = venues.id INNER JOIN suburbs ON suburbs.id = venues.suburb LEFT JOIN hotspots ON suburbs.id = hotspots.suburb_id WHERE ((venues.venue_name = ?) OR (checkins.user_id = ?))" ;
                param.push(req.body.search);
                param.push(req.body.search);
            }
            else if(req.session.user_type === "VENUE"){
                query = "SELECT 'VENUE', checkins.date_time, checkins.user_id, venues.venue_name, suburbs.suburb_name, hotspots.id AS hotspot FROM checkins INNER JOIN venues ON checkins.venue_id = venues.id INNER JOIN suburbs ON suburbs.id = venues.suburb LEFT JOIN hotspots ON suburbs.id = hotspots.suburb_id WHERE checkins.venue_id = ? AND (checkins.user_id = ?)" ;
                param.push(req.session.venue_id);
                param.push(req.body.search);
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


router.post('/checkin', function(req, res) {

    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }

        var query = 'INSERT INTO checkins (venue_id, user_id, date_time) VALUES (?, ?, NOW())' ;

        connection.query(query, [req.body.code, req.session.user_id], function(err) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.end();
        });
    });
});

router.post('/checkinLocation', function(req, res) {

    req.pool.getConnection(function(err,connection) {
        if (err) {
            res.sendStatus(500);
            return;
        }

        var query = 'INSERT INTO checkins (user_id, date_time, lat, lng) VALUES (?, NOW(), ?, ?)' ;

        connection.query(query, [req.session.user_id, req.body.lat, req.body.lng], function(err) {
            connection.release();
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.end();
        });
    });
});


module.exports = router;
