const express = require("express");
const app = express();
app.use(express.json());

app.post("/webhook/kirishima", (req, res) => {
    console.log("LINE webhook受信:", req.body);
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
