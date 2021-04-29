const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const msgSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    message : {
        type : String,
        required : true
    },
    channelId : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('Msg', msgSchema)