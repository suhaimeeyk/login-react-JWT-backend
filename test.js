app.get('/Editdb_data/:data_id', (req, res) => {
    let data_id = req.params.data_id;

    if (!data_id) {
        return res.status(400).send({ error: true, message: "Please provide  data_id" });
    } else {
        connection.query("SELECT * FROM db_data,db_customer,db_catwithdraw,db_users where db_catwithdraw.catwithdraw_id=db_data.cat_id and data_usersid=db_customer.customer_id and db_users_id=db_users.users_id and  users_id = ?", data_id, (error, results, fields) => {
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