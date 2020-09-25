const requestIp = require('request-ip');

function DefaultResposeHeaders() {
    return function (req, res, next) {
        req.client_ip_address = requestIp.getClientIp(req);
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
        res.header(
            'Access-Control-Allow-Methods', 'DELETE, GET, POST, PUT, PATCH');
        next();
    };
}

module.exports = {DefaultResposeHeaders}