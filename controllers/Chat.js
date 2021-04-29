const Msg = require('../routes/chatmessage');

exports.getMessage = (req, res, next) => {
    Msg.find({'channelId':"user1"})
    .then(messages => {
        res.send(messages);
    })
    .catch(err => console.log(err));
}

exports.postMessage = (req, res, next) => {

}