const express = require("express");
const { Client } = require("@line/bot-sdk");

const app = express();
app.use(express.json());

// LINE Botの設定（トークンやシークレットを環境変数から取得）
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new Client(config);

app.post("/webhook/kirishima", (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.error("Error:", err);
      res.sendStatus(500);
    });
});

function handleEvent(event) {
  // POSTBACK処理（ボタンが押されたとき）
  if (event.type === "postback") {
    const data = event.postback.data;
    if (data === "today") {
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "📅 今日の釣り情報はこちら！\n潮：中潮\n満潮：12:34\n天気：晴れ☀️\n風：微風\n釣れやすさ：◎",
      });
    } else if (data === "tomorrow") {
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "📅 明日の釣り情報はこちら！\n潮：小潮\n満潮：13:10\n天気：曇り時々晴れ⛅\n風：やや強い\n釣れやすさ：◯",
      });
    }
  }

  // 通常メッセージ対応（オプション）
  if (event.type === "message" && event.message.type === "text") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "釣りBotです🐟\nメニューのボタンから「今日」「明日」を選んでください♪",
    });
  }

  return Promise.resolve(); // 他のイベントはスルー
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
