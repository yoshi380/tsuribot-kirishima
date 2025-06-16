const express = require("express");
const app = express();

app.use(express.json()); // JSONボディを使えるように

// LINEのWebhook受信
app.post("/webhook/kirishima", (req, res) => {
    console.log("📩 Webhook受信:", JSON.stringify(req.body, null, 2));

    // メッセージイベントが届いたか確認（任意）
    if (req.body.events && Array.isArray(req.body.events)) {
        req.body.events.forEach((event) => {
            console.log("👉 イベント内容:", event);
        });
    }

    res.sendStatus(200); // LINEに「受け取ったよ」と返す
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});