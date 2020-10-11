const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "public/index.html")
})

const server = http.createServer(app);
server.listen(process.env.PORT || 8080);
