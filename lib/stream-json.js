    const https = require('https');
    const urlParse = require('url').parse;

module.exports = url => {
    return new Promise((resolve, reject) => {
        const req = https.request(Object.assign(urlParse(url), {method : "GET"}), res => {
            resolve(res);
        });
        req.end();
    });
}