const http2 = require('http2');
const IncomingMessage = require('./lib/incoming');
const OutcomingMessage = require('./lib/outcoming');

function Server(options) {
    this.server = http2.createSecureServer(options);
    this.server.on('error', (e) => console.log(e));

    this.getRequests = {
        '/': (req, res) => {
            return res.send('<h1>Hello from http2_server</h1>')
        }
    };
    this.postRequests = {};

    this.server.on('stream', (stream, headers, flags) => {
        const req = new IncomingMessage(stream, headers, flags);
        const res = new OutcomingMessage(stream);
        const urlGetHandler = this.getRequests[req.getPath()];
        const urlPostHandler = this.postRequests[req.getPath()];

        if (urlGetHandler && req.getMethod() === 'GET') {
            urlGetHandler(req, res);
        } else if (urlPostHandler && req.getMethod() === 'POST') {
            urlPostHandler(req, res);
        }
    });

    this.server.on('close', () => console.log('closed'));

    return this;
};

Server.prototype.listen = function(port, cb) {
    this.server.listen(port, cb);
    return this;
};

Server.prototype.get = function(requests) {
    this.getRequests = {...this.getRequests, ...requests};
    return this;
};

Server.prototype.post = function(requests) {
    this.postRequests = {...this.postRequests, ...requests};
    return this;
};

module.exports = Server;