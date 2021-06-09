var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/login', function(req,res,next){
    
    

    //get connection
    console.log("new user");
    console.log(req.body.email) ;
    req.pool.getConnection(function(err, connection){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        }

        //var body = req.body;
        //var email = body.email;
        //var password = body.password;

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
                    console.log(result[0].pasword_hash)
                    req.session.email = result[0].email;
                    req.session.user_type = result[0].user_type;

                    res.redirect("/");
                }else{
                    res.redirect("/Login.html#login_failed");
                }
            });
        });
    });
});

router.use(function(req, res, next) {
    if('email' in req.session){
        next();
    }
    else {
        res.sendStatus(401);
    }
});

router.post('/logout', function(req, res, next) {
    delete req.session.email;
    res.send();
});

module.exports = router;
