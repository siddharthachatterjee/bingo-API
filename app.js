const express = require("express");
const cors = require("cors");
const http = require("http");



const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("BINGO API by Siddhartha Chatterjee")
});


const server = http.createServer(app);
server.listen(process.env.PORT || 8000);
const socketIO = require("socket.io")(server);

const TICKET_COST = 2, STARTING_MONEY = 5;

const games = {};

const emitUpdate = room => socketIO.emit(`game${room}-updated`, games[room]);
    
function generateTicket() {
    const ticket = Array(3).fill(null).map(() => Array(9).fill(null));
    const availableNumbers = Array(90).fill(null).map((_, i) => i + 1);
    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 5; ++j) {
            do {
                var randi = Math.floor(Math.random() * availableNumbers.length);
            } while (ticket[i].some(num => Math.floor(num / 10) == Math.floor(availableNumbers[randi] / 10)))
            ticket[i][Math.floor(availableNumbers[randi] / 10)] = {
                value: availableNumbers[randi],
                covered: false
            }
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
    started = false;
    availableNumbers = Array(90).fill(null).map((_, i) => i + 1);
    host;
    chat = [];
    constructor(host, hostid) {
        this.key = generateKey();
        this.host = host;
      
        this.join(host, hostid);

    }
    join(playername, playerid) {
        this.players.push(new Player(playername, playerid));
        emitUpdate(this.key);
    }
    start() {
        if (!this.started) {
            this.started = true;
            emitUpdate(this.key)
            setInterval(() => {
                this.callNumber();
            }, 3000)
        }
    }
    callNumber() {
        let randi = Math.floor(Math.random() * this.availableNumbers.length);
        let randnum = this.availableNumbers[randi];
        this.availableNumbers.splice(randi, 1);
        this.players.forEach(player => {
            player.tickets = player.tickets.map(ticket => (
                ticket.map(row => row.map(square => {
                    if (square && square.value == randnum) {
                        return {value: randnum, covered: true}
                    }
                    return square;
                }))
            ))
        })
        emitUpdate(this.key);
    }
}



app.get("/games", (req, res) => {
    res.send(JSON.stringify(games))
});


app.get("/games/:key", (req, res) => {
    res.send(JSON.stringify(games[req.params.key]))
})

app.get("/games/:key/:prop", (req, res) => {
    res.send(JSON.stringify({ data: games[req.params.key][req.params.prop] }))
})

app.post("/new", (req, res) => {
    const game = new Game(req.query.host, req.query.hostid);
    games[game.key] = game;
    res.send(JSON.stringify(game))
})

app.put("/join/:key", (req, res) => {
    if (!(req.params.key in games)) {
        res.status(404).send("ERROR: there is no existing game with the key you entered")
    } else {
        games[req.params.key].join(req.query.name, req.query.id);
        res.send("");
    }
})

app.put("/start/:key", (req, res) => {
    games[req.params.key].start();
})

app.put("/chat/:key", (req, res) => {
    games[req.params.key].chat.push(req.query)
});

app.put("/buy/:key", (req, res) => {
    games[req.params.key].players = games[req.params.key].map(player => {
        if (player.id == req.query.playerid) {
            player.buyTicket();
            return player;
        }
        return player;
    })
})