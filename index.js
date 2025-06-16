const express = require('express');
const { Client } = require('@line/bot-sdk');
const bodyParser = require('body-parser');

// LINE Messaging API設定
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new Client(config);
const app = express();

app.use(bodyParser.json());

// Webhookエンドポイント
app.post('/webhook/kirishima', async (req, res) => {
  const events = req.body.events;
  if (!events || events.length === 0) {
    return res.status(200).send('No events');
  }

  // イベントごとに処理
  const results = await Promise.all(events.map(async (event) => {
    if (event.type === 'message' && event.message.type === 'text') {
      const text = event.message.text;

      // キーワードに応じた返信
      if (text === '今日') {
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: '今日の釣り情報：晴れ、潮は中潮、満潮は朝6:30頃です🎣'
        });
      } else if (text === '明日') {
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: '明日の釣り情報：曇りのち晴れ、潮は大潮、満潮は朝7:00頃です🌊'
        });
      } else {
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'キーワードは「今日」か「明日」で送ってね！'
        });
      }
    }
  }));

  res.status(200).json(results);
});

// ポート設定（Render用）
const port = process.env.PORT || 18000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});