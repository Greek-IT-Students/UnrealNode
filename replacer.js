const replacer = function (req, res, next) {
    req.body = Object.keys(req.body).length == 0 ? req.query : req.body;

    var obj = {};
    obj.url = req.originalUrl;
    obj.body = req.body;

    console.log(JSON.stringify(obj));

    next();
};


module.exports = replacer