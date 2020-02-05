require('dotenv').config(); // module to load the '.env' file, where your environment variables will be stored

const express = require('express'); // Requesting the express dependency installed in our project previously
const morgan = require('morgan');  // Requesting the morgan dependency installed in our project previously
const bodyParser = require('body-parser'); // Requesting the body-parser dependency installed in our project previously

const port = process.env.PORT; // variable port is equals environment variable PORT, stored in the '.env' file
const app = express(); // Using the method express 

app.use(morgan('dev')); // It will be used to display in the terminal the routes that the express server is listening

/**
 * Setting BodyParser in our Express server:
 */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/*
* Our first route, when our express server listens
* a GET request in the '/' route it will return
* a status 200 and a string 'Hello World' to the
* client
*/
app.get('/', (req, res, next) => {
    return res.status(200).send('Hello World');
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