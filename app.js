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

const emitUpdate = room => socketIO.emit(`game${room}-updated`);

const TICKET_COST = 2, STARTING_MONEY = 5;

const games = {};

function generateTicket() {
    const ticket = Array(3).fill(null).map(() => Array(9).fill(null));
    const availableNumbers = Array(90).fill(null).map((_, i) => i + 1);
    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 5; ++j) {
            do {
                var randi = Math.floor(Math.random() * availableNumbers.length);
            } while (ticket[i].some(num => Math.floor(num / 10) == Math.floor(availableNumbers[randi] / 10)))
            ticket[i][Math.floor(availableNumbers[randi] / 10)] = availableNumbers[randi];
            availableNumbers.splice(randi, 1);
        }
    }
    return ticket;
}

function generateKey() {
    do {
        var key = Math.floor(Math.random() * 1e5 * 9) + 1e5;
    } while (key.toString() in games)
    return key;
}

class Player {
    tickets = [];
    money = STARTING_MONEY;
    name;
    id;
    constructor(name, id) {
        this.id = id;
        this.name = name;
    }
    buyTicket() {
        if (this.money > TICKET_COST) {
            this.tickets.push(generateTicket());
            this.money -= TICKET_COST;
        }
    }
}

class Game {
    key;
    players = [];
    host;
    chat = [];
    constructor(host, hostid) {
        this.key = generateKey();
        this.host = host;
        this.players.push(new Player(host, hostid));
    }
    join(playername, playerid) {
        this.players.push(new Player(playername, playerid))
    }
}

app.get("/games", (req, res) => {
    res.send(JSON.stringify(games))
})