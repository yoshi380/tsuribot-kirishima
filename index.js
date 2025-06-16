const express = require('express');
const line = require('@line/bot-sdk');
const app = express();
app.use(express.json());  // ← これが重要！

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new line.Client(config);

app.post('/webhook', (req, res) => {
  if (!req.body.events) {
    return res.status(500).send('No events in body');
  }

  Promise
    .all(req.body.events.map(event => {
      if (event.type === 'message' && event.message.type === 'text') {
        const replyText = (event.message.text.includes("今日"))
          ? "📡 今日の釣果予報をお届けします！"
          : (event.message.text.includes("明日"))
            ? "🌙 明日の釣果予報をチェック！"
            : "ごめんなさい、わかりませんでした。";
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: replyText
        });
      } else {
        return Promise.resolve(null);
      }
    }))
    .then(() => res.status(200).end())
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
