const mongoose = require('mongoose');

const schema = new mongoose.Schema({

    TimeOfOccurence:{
        type:String,
        required:true,
        default:null
    },

    Error:{
        type:String,
        required:true,
        default:null
    },
    ErrorStack:String
});

module.exports = mongoose.model('ErrorLog', schema);