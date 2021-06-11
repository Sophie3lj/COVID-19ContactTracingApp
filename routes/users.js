var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/login', function(req,res,next){

    var bcrypt = require('bcrypt');
    //get connection
    console.log("new user");
    console.log(req.body.email) ;
    req.pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        }

        connection.query("SELECT id, email, password_hash, user_type FROM accounts WHERE email = ?", [req.body.email], function(err, result){
            connection.release();
            if(err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }

            //Email is incorrect
            if(result[0] === undefined){
                res.redirect("/Login.html#login_failed");
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

router.get('/publicLoginCheck', function(req, res){
    if('email' in req.session){
        res.send(true);
    }
    else {
        res.send(false);
    }
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

module.exports = router;
