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
    database: 'therubber2'
  });

  

app.post('/register',jsonParser, function (req, res, next) {
    bcrypt.hash(req.body.users_password, saltRounds, function(err, hash) {

        connection.execute(
            'INSERT INTO db_users (users_usersname,users_password,users_name,users_tel) VALUES (?,?,?,?)',
            [req.body.users_usersname, hash, req.body.users_name, req.body.users_tel ],
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
        'SELECT * FROM db_users WHERE users_usersname=?',
        [req.body.users_usersname],
        function(err, users, fields) {
            if (err) { res.json({status: 'error' , message: err}); return }
            if (users.length == 0) { res.json({status: 'error' , message: 'no user found'}); return }
            bcrypt.compare(req.body.users_password, users[0].users_password , function(err, isLogin) {

                if (isLogin) {
                    var token = jwt.sign({ email: users[0].email }, secret, { expiresIn: '1h' } );
                    res.json({status: 'ok', message: 'Login success',token, users_id: users[0].users_id})
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



app.get('/Users',jsonParser, function (req, res, next)  {

        connection.execute(
            'SELECT * FROM db_users',
            function(err, results, fields) {
                if (err) {
                    res.json({status: 'error' , message: err})
                    return
                }
                res.json({results})
            }
        );
})

// app.get('/Usersone',jsonParser, function (req, res, next)  {

//         connection.execute(
//             'SELECT * FROM db_users WHERE users_id = ?',
//             users_id,
//             function(err, results, fields) {
//                 if (err) {
//                     res.json({status: 'error' , message: err})
//                     return
//                 }
//                 res.json({results})
//             }
//         );
// })

// app.get('/:user_id', async (req, res) => {
//     const userID = req.params.user_id;
//     try {
//       const user = await User.findById(userID).exec();
//       res.json(user);
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send('Server Error');
//     }
//   })


  app.get('/EditUser/:users_id', (req, res) => {
    let users_id = req.params.users_id;

    if (!users_id) {
        return res.status(400).send({ error: true, message: "Please provide  users_id"});
    } else {
        connection.query("SELECT * FROM  db_users WHERE users_id = ?", users_id, (error, results, fields) => {
            if (error) throw error;

            let message = "";
            let status = "Ok";
            if (results === undefined || results.length == 0) {
                message = "Book not found";
            } else {
                message = "Successfully data";
            }

            return res.send({ status: status, data: results[0] , message: message})
        })
    }
})


app.put('/EditUser',jsonParser, function (req, res, next) {
    bcrypt.hash(req.body.users_password, saltRounds, function(err, hash) {

        connection.query(
            ' UPDATE db_users SET users_usersname = ?, users_password = ?, users_name = ?, users_tel = ? WHERE users_id = ?',
            [req.body.users_usersname, hash, req.body.users_name, req.body.users_tel , req.body.users_id],
            function(err, results, fields) {
                    let status = "Ok";
                    let message = "";
                if (results.changedRows === 0) {
                    message = "Book not found or data are same";
                } else {
                    message = "successfully updated";
                }

                return res.send({status: status, error: false, data: results, message: message })

            }
        );
    });
})




app.delete('/Users_id',jsonParser, function (req, res, next)  {

    connection.execute(
        'DELETE FROM db_users WHERE users_id = ?',
        [req.body.users_id],
        function(err, results, fields) {
            if (err) {
                res.json({status: 'error' , message: err})
                return
            }
            // res.json({results})
            res.json({status: 'Ok'})
        }
    );
})

// ประเภทสมาชิก

app.post('/Createdb_catusers',jsonParser, function (req, res, next) {
    bcrypt.hash(req.body.users_password, saltRounds, function(err, hash) {

        connection.execute(
            'INSERT INTO db_catusers (catusers_name) VALUES (?)',
            [req.body.catusers_name],
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

app.get('/db_catusers',jsonParser, function (req, res, next)  {

    connection.execute(
        'SELECT * FROM db_catusers',
        function(err, results, fields) {
            if (err) {
                res.json({status: 'error' , message: err})
                return
            }
            res.json({results})
        }
    );
})

app.delete('/db_catusers_id',jsonParser, function (req, res, next)  {

    connection.execute(
        'DELETE FROM db_catusers WHERE catusers_id = ?',
        [req.body.catusers_id],
        function(err, results, fields) {
            if (err) {
                res.json({status: 'error' , message: err})
                return
            }
            // res.json({results})
            res.json({status: 'Ok'})
        }
    );
})

app.get('/EditUserdb_catusers/:catusers_id', (req, res) => {
    let catusers_id = req.params.catusers_id;

    if (!catusers_id) {
        return res.status(400).send({ error: true, message: "Please provide  catusers_id"});
    } else {
        connection.query("SELECT * FROM  db_catusers WHERE catusers_id = ?", catusers_id, (error, results, fields) => {
            if (error) throw error;

            let message = "";
            let status = "Ok";
            if (results === undefined || results.length == 0) {
                message = "not found";
            } else {
                message = "Successfully data";
            }

            return res.send({ status: status, data: results[0] , message: message})
        })
    }
})


app.put('/EditUserdb_catusers',jsonParser, function (req, res, next) {
    bcrypt.hash(req.body.users_password, saltRounds, function(err, hash) {

        connection.query(
            ' UPDATE db_catusers SET catusers_name = ? WHERE catusers_id = ?',
            [req.body.catusers_name, req.body.catusers_id],
            function(err, results, fields) {
                    let status = "Ok";
                    let message = "";
                if (results.changedRows === 0) {
                    message = " not found or data are same";
                } else {
                    message = "successfully updated";
                }

                return res.send({status: status, error: false, data: results, message: message })

            }
        );
    });
})



app.listen(3333,function () {
  console.log('CORS-enabled web server listening on port 3333')
})