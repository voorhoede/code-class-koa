const express = require('express');
const http = require('http');
const getJSON = require('../lib/get-json');

const app = express();

/**
 * Exercise about errors
 * 
 * Note that the error handler should be the last middleware registered and 
 * it should accept the following parameters: err, req, res, next (otherwise it won't work)
 */

app.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send(`
        <h1>Express</h1>
        <ul>
            <li><a href='/1'>/1</a></li>
            <li><a href='/2'>/2</a></li>
            <li><a href='/3'>/3</a></li>
        </ul>
    `);
});

app.get("/1", (req, res, next) => {
    throw new Error("Something went wrong");
});

app.get("/2", async (req, res, next) => {
    //try removing the try catch and see what happens
    try {
        await getJSON('https://swapi.co/api/films2/');
    }
    catch(e) {
        next(e);
    }
});

app.get("/3", (req, res, next) => {
    res.status(403).send('Access denied!');
});

/**
 * Error is catched here
 */
app.use((err, req, res, next) => {
    res.send(`Error: ${err.message}`);
});

http.createServer(app).listen(3001);