const Koa = require('koa');
const Router = require('koa-router');
const http = require('http');
const getJSON = require('../lib/get-json');

const app = new Koa();
const router = new Router();

/**
 * Exercise about errors
 * 
 * Create a middleware to catch all errors which are thrown here
 */

router.get('/', async (ctx, next) => {
    ctx.set("Content-Type", "text/html");
    ctx.body = `
        <h1>Koa</h1>
        <ul>
            <li><a href='/1'>/1</a></li>
            <li><a href='/2'>/2</a></li>
            <li><a href='/3'>/3</a></li>
        </ul>
    `
});

router.use(async (ctx, next) => {
    try {
        await next();
    }
    catch(e) {
        ctx.status = e.status || 500;
        ctx.body = `Error: ${e.message}`
    }
});

/**
 * The next routes all throw a error
 */

router.get("/1", (ctx, next) => {
    throw new Error("Something went wrong");
});

router.get("/2", async (ctx, next) => {
    await getJSON('https://swapi.co/api/films2/');
});

router.get("/3", (ctx, next) => {
    ctx.throw(403, 'Access denied!');
});

app.use(router.routes());

http.createServer(app.callback()).listen(3000);