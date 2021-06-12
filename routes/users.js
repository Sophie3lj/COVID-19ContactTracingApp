var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Query database for AccountDetails.html !!NEED SESSION CODE!! */
router.get('/getAccountDetails', function(req, res, next) {
   req.pool.getConnection( function(err, connection) {
       if (err) {
           res.sendStatus(500);
           return;
       }
       var userID = req.session.userID;
       /* Query for USER. Will need to check user type and adjust */
       var query = "SELECT first_name, last_name, email, phone_number FROM Accounts WHERE Accounts.id = ?";
       connection.query(query, [userID], function(err, rows, fields) {
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
