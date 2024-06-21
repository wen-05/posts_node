const headers = require('./headers');

const handleError = (res, message) => {
    res.writeHead(400, headers);

    res.write(JSON.stringify({
        "status": "false",
        "message": message
    }));
    res.end();
}

module.exports = handleError;