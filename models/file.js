const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fileSchema = Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    fileUrl : {
        type : String,
        required : true
    },
    userId : {
        type : String,
        required : true
    },
    channelId : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('File', fileSchema);