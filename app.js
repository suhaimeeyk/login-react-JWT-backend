var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const bcrypt = require('bcrypt')
const saltRounds = 10

var jwt = require('jsonwebtoken')
const secret = 'Login-React' ;

app.use(cors())

const mysql = require('mysql2');
// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'mydb'
  });

app.post('/register',jsonParser, function (req, res, next) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        
                    // execute will internally call prepare and query
        connection.execute(
            'INSERT INTO users (email,password,fname,lname) VALUES (?,?,?,?)',
            [req.body.email, hash, req.body.fname, req.body.lname ],
            function(err, results, fields) {
                if (err) {
                    res.json({status: 'error' , message: err})
                    return
                }
                res.json({status: 'Ok'})
            }
        );
    });
})

app.post('/login',jsonParser, function (req, res, next) {
    connection.execute(
        'SELECT * FROM users WHERE email=?',
        [req.body.email],
        function(err, users, fields) {
            if (err) { res.json({status: 'error' , message: err}); return }
            if (users.length == 0) { res.json({status: 'error' , message: 'no user found'}); return }
            bcrypt.compare(req.body.password, users[0].password , function(err, isLogin) {
                // result == true
                if (isLogin) {
                    var token = jwt.sign({ email: users[0].email }, secret, { expiresIn: '1h' } );
                    res.json({status: 'ok', message: 'Login success',token})
                } else {
                    res.json({status: 'error', message: 'Login failed'})
                }
            });
        }
    );
})

app.post('/authen',jsonParser, function (req, res, next) { 
    try {
        const token =  req.headers.authorization.split(' ')[1]
        var decoded = jwt.verify(token, secret);
        res.json({status : 'ok' , decoded})
    } catch(err) {

        res.json({status : 'error' , message : err.message })
    }

})



app.listen(3333,function () {
  console.log('CORS-enabled web server listening on port 3333')
})