const express = require('express');
const http = require('http');
const streamJSON = require('../lib/stream-json');
const path = require('path');
const fs = require('fs');

const app = express();

/**
 * Exercise about responses
 */

app.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send(`
        <h1>Express</h1>
        <ul>
            <li><a href='/image'>/image</a></li>
            <li><a href='/stream'>/stream</a></li>
            <li><a href='/json'>/json</a></li>
        </ul>
    `);
});

app.get("/image", (req, res) => {
    res.setHeader("Content-Type", "image/jpeg");
    res.sendFile(path.resolve("data/cat.jpg"));
});

app.get("/stream", (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    streamJSON('https://swapi.co/api/films/')
        .then(stream => {
            stream.on('error', next);
            stream.pipe(res);
        });
});

app.get("/json", (req, res, next) => {
    fs.readFile('data/films.json', 'utf8', (err, data) => {
        if(err) {
            return next(err);
        }
        res.json( JSON.parse(data) );
    });
});

http.createServer(app).listen(3001);