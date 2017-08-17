const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const etag = require('etag');
const fs = require('fs');

const app = express();

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

app.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send(`
        <h1>Express</h1>
        <ul>
            <li><a href='/minified'>/minified</a></li>
            <li><a href='/auth'>/auth</a></li>
            <li><a href='/etag'>/etag</a></li>
        </ul>
    `);
});

 /**
  * 1. Minify middleware ('after' middleware)
  * 
  * Minify the html response using the 'minify' function
  */
const {minify} = require('html-minifier');
const minifyMiddleware = (req, res, next) => {
    const oldSend = res.send;
    res.send = function (html) {
        oldSend.call(this, minify(html, minifyOptions));
    }
    next();
};

app.get("/minified", minifyMiddleware, (req, res, next) => {
    fs.readFile('data/site.html', 'utf8', (err, data) => {
        if(err) {
            return next(err);
        }
        res.send(data);
    });
});


/*
    2. Authentication middleware ('before' middleware)
    
    - read the username, password and posted from the request body
    - show the login form when 'posted' is not defined
    - otherwise validate the username and password
    - throw a 403 when username or password is incorrect
*/
const authMiddleware = (req, res, next) => {
    const {username, password, posted} = req.body;
    if(!posted) {
        return res.send(`
            <form method=post action=/auth>
                <input type=hidden name=posted value=1>
                Username: <input type=text name=username><br>
                Password: <input type=password name=password><br>
                <input type=submit>
            </form>
        `);
    }
    if (username !== 'admin' || password !== 'admin') {
        res.status(403).send('Access denied');
        return;
    }
    next();
}

app.all('/auth', bodyParser.urlencoded({extended : true}), authMiddleware, (req, res, next) => {
    res.send('Access granted!');
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
const etagMiddleware = (req, res, next) => {
    const previousETag = req.get('If-None-Match');

    const oldSend = res.send;
    res.send = function (body) {
        const newETag = etag(body);
        if(newETag === previousETag) {
            res.status(304).end();
            return;
        }
        res.set('ETag', newETag);
        oldSend.call(this, body);
    }

    next();
}

app.get("/etag", etagMiddleware, (req, res, next) => {
    fs.readFile('data/site.html', 'utf8', (err, data) => {
        if(err) {
            return next(err);
        }
        res.send(data);
    });
});

http.createServer(app).listen(3001);