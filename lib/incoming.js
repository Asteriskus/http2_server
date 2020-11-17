const http2 = require('http2');
const {
    HTTP2_HEADER_METHOD,
    HTTP2_HEADER_PATH,
  } = http2.constants;

function IncomingMessage(stream, headers, flags) {
    this.stream = stream;
    this.headers = headers;
    this.flags = flags;

    this.stream.on('data', (data) => {
        this.body = data.toString();
    });
};

IncomingMessage.prototype.getMethod = function() {
    return this.headers[HTTP2_HEADER_METHOD];
};

IncomingMessage.prototype.getPath = function() {
    return this.headers[HTTP2_HEADER_PATH];
};

module.exports = IncomingMessage;