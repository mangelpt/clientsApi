const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3080;
const app = express();
const temporalData = require('./TemporalData');
const categories= require('./categories');
app.use(bodyParser.json());
app.use(cors())

// MySql
const connection = mysql.createPool({
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'b6a0f6ea76a433',
    password: '4fc83a75',
    database: 'heroku_2be4d4450185779'
});

// Route
app.get('/', (req, res) => {
    res.send('Welcome to my API!');
});

// all customers
app.get('/customers', (req, res) => {
    const sql = 'SELECT * FROM customers';
    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('Not result');
        }
    });
});

/*all products */
app.get('/products', (req, res) => {
    if (temporalData) {
        res.status(200).send(temporalData);
    } else {
        res.status(400).send("data not found");
    }

})
/*all categories*/
app.get('/categories', (req, res) => {
    if (categories) {
        res.status(200).send(categories);
    } else {
        res.status(400).send("data not found");
    }

})
/*single customer*/
app.get('/customers/:id', (req, res) => {
    const {id} = req.params;
    const sql = `SELECT *
                 FROM customers
                 WHERE id = ${id}`;
    connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).send('Not result');
        }
    });
});
/*add new costumer*/
app.post('/add', (req, res) => {
    const sql = 'INSERT INTO customers SET ?';
    const customerObj = {
        name: req.body.name,
        lastName: req.body.last,
        birthDate: req.body.date
    };
    connection.query(sql, customerObj, error => {
        if (error) throw error;
        res.send('Customer created!');
    });
});
/*delete customer*/
app.delete('/delete/:id', (req, res) => {
    const {id} = req.params;
    const sql = `DELETE
                 FROM customers
                 WHERE id = ${id}`;

    connection.query(sql, error => {
        if (error) throw error;
        res.send('Delete customer');
    });
});

/*age average */
app.get('/average', (req, res) => {
    const sql = 'SELECT AVG(YEAR(NOW())-YEAR(birthDate)) as `Average` FROM customers';
    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('Not result');
        }
    });
});

// Check connect
connection.getConnection(error => {
    console.log(error)
    if (error) throw error;
    console.log('Database server running!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));