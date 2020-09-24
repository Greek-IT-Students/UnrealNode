const router = require('express').Router();
const Account = require('./models/account');


router.use('/register', (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;

    Account.findOne({'username': username}, (err, exists) => {
        if (err) return next(err);

        if (exists) return next(new Error('account already registered!'));

        var account = new Account({
            username: username,
            password: password,
            data:{
                SessionsCount: 1
            }
        });

        account.save((err, newAccount) => {
            if (err) return next(err);

            res.json({status: 200, message: 'New account has been created!', account: newAccount});
        });
    });
});

router.use('/getData', (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;

    Account.findOne(
        {'username': username, 'password': password},
     (err, account) => {
        if (err) return next(err);
        if (!password) return next(new Error('enter your password!'));
        if (!account) return next(new Error('account cannot be found!'));
        
        res.json({status: 200, message: 'ok', account: account});
    });
});

router.use('/saveData', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var data = req.body.data;
    var sessionscount = req.body.sessionscount;

    if (typeof data === 'string') {
        data = JSON.parse(data);
    }

    Account.findOneAndUpdate({
        'username': username,
        'password': password
    }, {$addToSet: {'data.Session': data}, $set:{'data.SessionsCount': sessionscount}}, {new: true}, (err, account) => {
        if (err) return next(err);

        if (!account) return next(new Error('account not registered!'));

        res.json({status: 200, message: 'ok', account: account});
    });
});

module.exports = router;