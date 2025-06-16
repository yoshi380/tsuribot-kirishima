const express = require("express");
const { Client, middleware } = require("@line/bot-sdk");

const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};

const app = express();
app.use(middleware(config));

const client = new Client(config);

app.post("/webhook/kirishima", (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

function handleEvent(event) {
    if (event.type !== "message" || event.message.type !== "text") {
        return Promise.resolve(null);
    }

    return client.replyMessage(event.replyToken, {
        type: "text",
        text: `受け取りました：「${event.message.text}」`
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});