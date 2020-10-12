const express = require("express");
const cors = require("cors");
const http = require("http");


const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("BINGO API by Siddhartha Chatterjee")
});

const server = http.createServer(app);
server.listen(process.env.PORT || 8080);
const socketIO = require("socket.io")(server);

const games = {};

function generateTicket() {
    const ticket = Array(3).fill(null).map(() => Array(9).fill(null));
    const availableNumbers = Array(90).fill(null).map((_, i) => i + 1);
    for (let i = 0; i < 3; ++i) {
       // const availableInRow = availableNumbers;
        for (let j = 0; j < 5; ++j) {
            //let randi;
            do {
                var randi = Math.floor(Math.random() * availableNumbers.length);
            } while (ticket[i].some(num => Math.floor(num / 10) == Math.floor(availableNumbers[randi] / 10)))
            ticket[i][Math.floor(availableNumbers[randi] / 10)] = availableNumbers[randi];
            availableNumbers.splice(randi, 1);
        }
    }
    return ticket;
}

console.log(generateTicket());