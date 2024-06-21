const headers = require('./headers');

const handleSuccess = (res, message, data) => {
  res.writeHead(200, headers);
  res.write(JSON.stringify({
    "status": "success",
    "message": message,
    "data": data
  }))
  res.end();
}
module.exports = handleSuccess;
