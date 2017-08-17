const Koa = require('koa');
const http = require('http');
const Router = require('koa-router');
const bluebird = require('bluebird');
const etag = require('etag');
const bodyParser = require('koa-bodyparser');
const readFileAsync = bluebird.promisify(require('fs').readFile);

const app = new Koa();
const router = new Router();

const minifyOptions = {
    caseSensitive : true,
    collapseWhitespace : true,
    collapseBooleanAttributes : true,
    collapseInlineTagWhitespace	: true,
    removeComments : true,
    removeEmptyElements : true,
    removeAttributeQuotes : true
};

/**
 * Exercise about different types of middleware
 */

router.get('/', async (ctx, next) => {
    ctx.set("Content-Type", "text/html");
    ctx.body = `
        <h1>Koa</h1>
        <ul>
            <li><a href='/minified'>/minified</a></li>
            <li><a href='/auth'>/auth</a></li>
            <li><a href='/etag'>/etag</a></li>
        </ul>
    `
});

 /**
  * 1. Minify middleware ('after' middleware)
  * 
  * Minify the html response using the 'minify' function
  */
const {minify} = require('html-minifier');
const compressHTMLMiddleware = async (ctx, next) => {
    await next();
    ctx.body = minify(ctx.body, minifyOptions);
};

router.get("/minified", compressHTMLMiddleware, async (ctx, next) => {
    ctx.body = await readFileAsync('data/site.html', 'utf8');
});

/*
    2. Authentication middleware ('before' middleware)
    
    - read the username, password and posted from the request body
    - show the login form when 'posted' is not defined
    - otherwise validate the username and password
    - throw a 403 when username or password is incorrect
*/

const loginFormHTML = `
<form method=post action=/auth>
    <input type=hidden name=posted value=1>
    Username: <input type=text name=username><br>
    Password: <input type=password name=password><br>
    <input type=submit>
</form>
`

const authMiddleware = async (ctx, next) => {
    const {username, password, posted} = ctx.request.body;
    if(!posted) {
        ctx.body = loginFormHTML;
        return;
    }
    if (username !== 'admin' || password !== 'admin') {
        ctx.throw(403, 'Access denied');
    }
    await next();
}

router.all('/auth', bodyParser(), authMiddleware, async (ctx, next) => {
    ctx.body = 'Access granted!';
});

/**
 * 3 Caching helper middleware ('before' and 'after' middleware)
 * 
 * - Get the old e-tag from the request (the 'If-None-Match' header)
 * - Generate the new e-tag from the response body
 * - Compare the old e-tag with the new e-tag
 * - If e-tag equals old e-tag then send status 304
 * - Otherwise set new e-tag
 */
const etagMiddleware = async (ctx, next) => {
    const previousETag = ctx.request.get('If-None-Match');
    await next();
    const newETag = etag(ctx.body);

    if(newETag === previousETag) {
        ctx.status = 304;
    }
    else {
        ctx.set('ETag', newETag);
    }
}

router.get("/etag", etagMiddleware, async (ctx, next) => {
    ctx.set('Content-Type', 'text/html');
    ctx.body = await readFileAsync('data/site.html');
});

app.use(router.routes());

http.createServer(app.callback()).listen(3000);