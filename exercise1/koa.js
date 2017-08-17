const Koa = require('koa');
const http = require('http');
const streamJSON = require('../lib/stream-json');
const bluebird = require('bluebird');
const path = require('path');
const fs = bluebird.promisifyAll( require('fs') );

const app = new Koa();

/**
 * Exercise about responses
 * 
 * Each route should return the same response as the routes in the express server (see express.js)
 */

app.use(async (ctx, next) => {
    if(ctx.path === "/") {
        ctx.set("Content-Type", "text/html");
        ctx.body = `
            <h1>Koa</h1>
            <ul>
                <li><a href='/image'>/image</a></li>
                <li><a href='/stream'>/stream</a></li>
                <li><a href='/json'>/json</a></li>
            </ul>
        `
    }
    else {
        await next();
    } 
});

app.use(async (ctx, next) => {
    if(ctx.path === "/image") {
        //return ./data/cat.jpg
    }
    else {
        await next();
    }
});

app.use(async (ctx, next) => {
    if(ctx.path === "/stream") {
        //return chunked https://swapi.co/api/films/'
    }
    else {
        await next();
    }
});

app.use(async (ctx, next) => {
    if(ctx.path === "/json") {
        //return data/films.json
    }
    else {
        await next();
    }
});

http.createServer(app.callback()).listen(3000);