const express = require("express");

const router = express.Router();



app.use("/channel", (req, res) => {
res.render('channel');
})


app.get("/messages", getMessage);


app.post("/messages", async (req, res) => {
try {

    const name = req.body.name;
    const msg = req.body.message;
    const channelId = "user1";
    var message = new Msg({
    name : name,
    message : msg,
    channelId : channelId
    });

    var savedMessage = await message.save();
    console.log("saved");

    var censored = await Msg.findOne({ message: "badword" });

    if (censored) await Msg.remove({ _id: censored.id });
    else io.emit("message", req.body);
    res.sendStatus(200);
} catch (error) {
    res.sendStatus(500);
    return console.error(error);
} finally {
    console.log("message post called");
}
});