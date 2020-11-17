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

    this.cache = {};

    this.server.on('stream', (stream, headers, flags) => {
        const req = new IncomingMessage(stream, headers, flags);
        const res = new OutcomingMessage(stream, headers, this.cache);
        const path = req.getPath();
        const method = req.getMethod();
        const urlGetHandler = this.getRequests[path];
        const urlPostHandler = this.postRequests[path];

        if (urlGetHandler && method === 'GET') {
            if ( this.cache[path] && !headers['cache-control'].includes('no-cache') ) {
                stream.respond(this.cache[path].headers);
                stream.end(this.cache[path].data);
            } else {
                urlGetHandler(req, res);
            }
        } else if (urlPostHandler && method === 'POST') {
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