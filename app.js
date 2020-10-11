const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("BINGO API by Siddhartha Chatterjee")
})

const server = http.createServer(app);
server.listen(process.env.PORT || 8080);
