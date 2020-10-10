const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("This is the Bingo API!")
})

const server = http.createServer(app);
server.listen(process.env.PORT || 8080);
