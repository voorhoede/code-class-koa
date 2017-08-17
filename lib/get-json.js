const https = require('https');
const urlParse = require('url').parse;

module.exports = url => {
    return new Promise((resolve, reject) => {
        const req = https.request(Object.assign(urlParse(url), {method : "GET"}), res => {

            let data = "";
            res.on('data', chunk => {
                data += chunk.toString();
            });

            res.on('end', () => {
                if(res.statusCode !== 200) {
                    return reject(new Error(`Could not get ${url} (status: ${res.statusCode})`));
                }

                try {
                    resolve(JSON.parse(data));
                }
                catch(e) {
                    reject(e);
                }
                
            });
        });
        req.end();
    });
}