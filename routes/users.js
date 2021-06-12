var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/login', function(req,res,next){

    var bcrypt = require('bcrypt');
    //get connection
    console.log("attempted login");
    console.log(req.body.email) ;
    req.pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        }

        connection.query("SELECT id, email, password_hash, user_type, first_name, last_name FROM accounts WHERE email = ?", [req.body.email], function(err, result){
            connection.release();
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
                    console.log('password matches');
                    req.session.email = result[0].email;
                    req.session.user_type = result[0].user_type;
                    req.session.user_id = result[0].id;
                    req.session.user_name = result[0].first_name + ' ' + result[0].last_name;
                    console.log('session set');
                    console.log(req.session.email + ', ' + req.session.user_type);
                    console.log('redirected');
                    res.send(result[0].user_type);
                }else{

                    res.sendStatus(401);
                }
            });
        });
    });
});

router.post('/GoogleLogin', function(req,res,next){
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
        connection.query("select id, email, password_hash FROM accounts WHERE email='"+email+"'", function(err, result){
            if(err) console.log(err);
            if(result[0]===undefined){
                connection.query("INSERT INTO accounts ( user_type, email, first_name, last_name, password_hash, phone_number) VALUES ('USER', '"+email+"', '"+first_name+"', '"+last_name+"', '-', '-')", function(err, result){
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

router.post('/logout', function(req, res, next) {
    delete req.session.email;
    delete req.session.user_type;
    delete req.session.user_id;
    res.end();
});

/* Query database for AccountDetails.html !!NEED SESSION CODE!! */
router.get('/getAccountDetails', function(req, res, next) {
   req.pool.getConnection( function(err, connection) {
       if (err) {
           res.sendStatus(500);
           return;
       }
       var user_id = req.session.user_id;
       var query;
       /* Query to get all neccessary data */
       if (req.session.user_type === "USER" || req.session.user.type === "ADMIN") {
           query = "SELECT accounts.first_name, accounts.last_name, accounts.email, accounts.phone_number FROM accounts WHERE accounts.id = ?";
       }
       else if (req.session.user_type === "VENUE") {
           query = "SELECT accounts.first_name, accounts.last_name, accounts.email, accounts.phone_number, venues.venue_name, venues.street_number, venues.street_name,  venues.postcode, venues.state, suburbs.suburb_name FROM ((accounts INNER JOIN venues ON accounts.id = venues.venue_owner) INNER JOIN suburbs ON venues.suburb = suburbs.id) WHERE accounts.id = ?";
       }
       connection.query(query, [user_id], function(err, rows, fields) {
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



module.exports = router;
