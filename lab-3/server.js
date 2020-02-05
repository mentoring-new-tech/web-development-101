require('dotenv').config(); // module to load the '.env' file, where your environment variables will be stored

const express = require('express'); // Requesting the express dependency installed in our project previously
const morgan = require('morgan');  // Requesting the morgan dependency installed in our project previously
const bodyParser = require('body-parser'); // Requesting the body-parser dependency installed in our project previously
const Cloudant = require('@cloudant/cloudant'); // Requesting the @cloudant/cloudant dependency installed in our project previously

const user = process.env.CLOUDANT_USER; // variable user is equals environment variable CLOUDANT_USER, stored in the '.env' file
const pw = process.env.CLOUDANT_PW; // variable pw is equals environment variable CLOUDANT_PW, stored in the '.env' file
const client = Cloudant({ account: user, password: pw }); // client is receiving a connection string to the Cloudant database

const port = process.env.PORT; // variable port is equals environment variable PORT, stored in the '.env' file
const app = express(); // Using the method express 

app.use(morgan('dev')); // It will be used to display in the terminal the routes that the express server is listening

/**
 * Setting BodyParser in our Express server:
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.get('/api/v1/suppliers/', (req, res, next) => {
    let query = {
        from: undefined,
        to: undefined
    } 

    /**
     * We check if the req.query.from and req.query.to are numbers and if req.query.to is higher than
     * req.query.from, if not the system is going to use the default value
     */
    if (Number(req.query.from) != 'NaN' && Number(req.query.to) != 'NaN' && Number(req.query.to) > Number(req.query.from)) {
        query.from = Number(req.query.from);
        query.to = Number(req.query.to);
    }

    let database = client.db.use('suppliers'); // We're telling which database we want to use
    /**
     * We call the 'list' method, which is a callback function
     * For any erros, we are going to throw a 500 error and
     * display 'Internal Server Error', never show to the user
     * err.message, as it is part of the developer scope, which
     * means that a regular user will be confused with this error
     * or a hacker could understand our DB structure and try to invade
     * our app
     */
    database.list({ include_docs: true, skip: query.from, limit: query.to }, // added skip and limit for pagination purposes
        function (err, body) {
            if (err) {
                console.log(err.message); // For troubleshooting purposes
                return res.status(500).json({
                    success: false,
                    message: 'Internal Server Error'
                })
            }
            return res.status(200).json({
                success: true,
                data: body.rows
            })
        });
    return 
})



app.get('/api/v1/suppliers/:id', (req, res, next) => {
    let id = req.params.id; // id receives value :id that came from the client url request
    let database = client.db.use('suppliers'); // We're telling which database we want to use
    database.get(id, function (err, body) {
        if (err) {
            console.log(err.message); // For troubleshooting purposes
            if (err.message === 'missing') {
                return res.status(404).json({
                    success: false,
                    message: 'Register not found in the database'
                })
            }
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            })
        }
        return res.status(200).json({
            success: true,
            data: body
        })
    });
})



app.post('/api/v1/suppliers/', (req, res, next) => {
    const doc = {
        name: req.body.name,
        cnpj: req.body.cnpj,
        address: req.body.address,
        tel: req.body.tel
    }

    let database = client.db.use('suppliers'); // We're telling which database we want to use
    database.insert(doc, (err, body, header) => {
        if (err) {
            console.log(err.message); // For troubleshooting purposes
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            })
        }
        /**
         * Insert id and rev generated in the Cloudant to our doc 
         * object to send it to the client
         */
        doc._id = body.id;
        doc._rev = body.rev;
        return res.status(200).json({
            success: true,
            data: doc
        })
    });
})



app.put('/api/v1/suppliers/:id', (req, res, next) => {
    const doc = {
        _id: req.params.id, // id receives value :id that came from the client url request
        name: req.body.name,
        cnpj: req.body.cnpj,
        address: req.body.address,
        tel: req.body.tel
    }
    /**
     * In order to update a document in the Cloudant
     * we need to find its current rev first, otherwise
     * the Cloudant will just generate a new document
     */
    let id = doc._id;
    let database = client.db.use('suppliers'); // We're telling which database we want to use
    database.get(id, function (err, body) {
        if (err) {
            console.log(err.message); // For troubleshooting purposes
            if (err.message === 'missing') {
                return res.status(404).json({
                    success: false,
                    message: 'Register not found in the database'
                })
            }
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            })
        }
        doc._rev = body._rev // rev of the document found on the database

        database.insert(doc, (err, body, header) => { // Now the insert function will update doc instead of creating a new record
            if (err) {
                console.log(err.message); // For troubleshooting purposes
                return res.status(500).json({
                    success: false,
                    message: 'Internal Server Error'
                })
            }
            /**
             * Insert id and rev generated in the Cloudant to our doc 
             * object to send it to the client
             */
            doc._id = body.id;
            doc._rev = body.rev;
            return res.status(200).json({
                success: true,
                data: doc
            })
        });
    });
})



app.delete('/api/v1/suppliers/:id', (req, res, next) => {
    /**
     * Like the update, the DELETE method needs an id and a rev
     */
    let id = req.params.id; // id receives value :id that came from the client url request
    let database = client.db.use('suppliers');
    database.get(id, function (err, body) {
        if (err) {
            console.log(err.message); // For troubleshooting purposes
            if (err.message === 'missing' || err.message === 'deleted') {
                return res.status(404).json({
                    success: false,
                    message: 'Register not found in the database'
                })
            }
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            })
        }
        database.destroy(id, body._rev, (err, body) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Internal Server Error'
                })
            }
            return res.status(200).json({
                success: true,
                message: 'Supplier deleted successfully.'
            })
        })
    });
})



/**
 * If the server does not find any GET url matching
 * it will fall here, as * means 'everything'
 */
app.get('*', (req, res, next) => {
    return res.status(404).send('Web page not found');
})



/* 
* Here is where the magic happens. We are telling
* the express server that it should listen to the
* value of the variable port 
*/
app.listen(port, () => {
    console.log(`Server listening at port ${port}.`);
})