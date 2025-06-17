// index.js

const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const getFishingInfo = require('./getFishingInfo');

const app = express();
app.use(express.json());

// Webhookエンドポイント
app.post('/webhook', async (req, res) => {
  try {
    const events = req.body.events;

    for (const event of events) {
      // メッセージタイプ＆textが存在するか安全にチェック
      if (
        event.type === 'message' &&
        event.message &&
        typeof event.message.text === 'string'
      ) {
        const userMessage = event.message.text;
        let replyText = '';

        if (userMessage.includes('今日')) {
          replyText = await getFishingInfo('today');
        } else if (userMessage.includes('明日')) {
          replyText = await getFishingInfo('tomorrow');
        } else {
          replyText = '「今日」か「明日」って言ってみてね！';
        }

        await replyToUser(event.replyToken, replyText);
      }
    }

    // LINEに「受け取ったよ」と返す（200が必須！）
    res.status(200).send('OK');
  } catch (err) {
    console.error('🌐 Webhook全体エラー:', err);
    res.sendStatus(500);
  }
});

// LINEに返信を送る関数
async function replyToUser(replyToken, message) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
  };
  const body = {
    replyToken: replyToken,
    messages: [{ type: 'text', text: message }]
  };

  try {
    await axios.post(url, body, { headers });
  } catch (err) {
    console.error('📩 LINEへの返信エラー:', err.response?.data || err.message);
  }
}

// サーバー起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ サーバー起動中 → http://localhost:${PORT}`);
});
