const ErrorLog =  require("./models/ErrorLog.js");

export function HandleErrors(err, req = null ,  res = null , next) {
    var timedate = new Date();
    var timedatestring = timedate.toJSON().split('T').join(' ');
    var log = new ErrorLog({
        TimeOfOccurence: timedatestring,
        Error: err.message,
        ErrorStack: err.stack,
    });
    log.save((err, newAccount) => {
        if (err) {
            console.log(err.message);
        } else
            console.log('---An Error Occured---');
    });
}