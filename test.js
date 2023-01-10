
app.get('/Editdb_data/:data_id', (req, res) => {
    let data_id = req.params.data_id;

    if (!data_id) {
        return res.status(400).send({ error: true, message: "Please provide  data_id" });
    } else {
        connection.query("SELECT * FROM  db_data WHERE data_id = ?", data_id, (error, results, fields) => {
            if (error) throw error;

            let message = "";
            let status = "Ok";
            if (results === undefined || results.length == 0) {
                message = "not found";
            } else {
                message = "Successfully data";
            }

            return res.send({ status: status, data: results[0], message: message })
        })
    }
})


app.put('/EditUserdb_data', jsonParser, function (req, res, next) {
    bcrypt.hash(req.body.users_password, saltRounds, function (err, hash) {

        connection.query(
            ' UPDATE db_data SET  data_usersid = ?, data_usersid = ?, cat_id = ?,data_totalgallon = ?,data_wgallon = ?,data_disgallon = ?,data_dryrubber = ?,data_price = ?,data_pricetotal = ?',
            [ req.body.data_usersid, req.body.cat_id , req.body.data_totalgallon , req.body.data_wgallon , req.body.data_disgallon, req.body.data_dryrubber , req.body.data_price , req.body.data_pricetotal ] ,
            function (err, results, fields) {
                let status = "Ok";
                let message = "";
                if (results.changedRows === 0) {
                    message = " not found or data are same";
                } else {
                    message = "successfully updated";
                }

                return res.send({ status: status, error: false, data: results, message: message })

            }
        );
    });
})

