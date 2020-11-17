const http2 = require('http2');
const {
    HTTP2_HEADER_STATUS,
    HTTP2_HEADER_CONTENT_TYPE,
  } = http2.constants;

function OutcomingMessage(stream) {
    this.stream = stream;
    this.headers = {
        [HTTP2_HEADER_STATUS]: '200',
        [HTTP2_HEADER_CONTENT_TYPE]: 'text/html; charset=utf-8', 
    };
    this.htmlRegex = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/;
};

OutcomingMessage.prototype.setHeader = function(key, value) {
    this.headers = {...this.headers, [key]: value };
};

OutcomingMessage.prototype.removeHeader = function(key) {
    delete this.headers[key];
};

OutcomingMessage.prototype.send = function(data) {
    if (typeof data === 'string') {
        if (this.htmlRegex.test(data)) {
            this.setHeader(HTTP2_HEADER_CONTENT_TYPE, 'text/html; charset=utf-8');
        } else {
            this.setHeader(HTTP2_HEADER_CONTENT_TYPE, 'text/plain; charset=utf-8');
        }
    } else if (typeof data === 'object') {
        data = JSON.stringify(data);
        this.setHeader(HTTP2_HEADER_CONTENT_TYPE, 'application/json; charset=utf-8');
    }
    this.stream.respond(this.headers);
    this.stream.end(data);
};

module.exports = OutcomingMessage;