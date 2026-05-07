/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

const https = require('https');
const path = require('path');
const fs = require('fs');
let server;

const localFolder = __dirname;

function writeNotFound(res) {
  res.writeHead(404, {'Content-Type': 'text/html'});
  res.end('<h1>404, Not Found!</h1>');
}

function requestHandler(req, res) {
  if (req.url === '/close') {
    res.end('server closing');
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  } else {
    const file = path.resolve(localFolder, req.url);
    if (!file.startsWith(localFolder + '/')) {
      writeNotFound(res);
      return;
    }

    fs.readFile(file, function (err, contents) {
      if (!err) {
        res.end(contents);
      } else {
        writeNotFound(res);
        return;
      }
    });
  }
}

const tlsOptions = {
  key: fs.readFileSync(process.env.HTTPS_KEY_PATH || 'server.key'),
  cert: fs.readFileSync(process.env.HTTPS_CERT_PATH || 'server.cert'),
};
server = https.createServer(tlsOptions, requestHandler).listen(8080);
