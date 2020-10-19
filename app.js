const express = require("express");
const cors = require("cors");
const http = require("http");
const express = require("express");



const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("BINGO API by Siddhartha Chatterjee")
});


const server = http.createServer(app);
const socketIO = require("socket.io").listen(server);

server.listen(process.env.PORT || 8080);

const TICKET_COST = 2, STARTING_MONEY = 5;

const games = {};

const emitUpdate = room => socketIO.emit(`game${room}-updated`, games[room]);
    
function generateTicket() {
    const ticket = Array(3).fill(null).map(() => Array(9).fill(null));
    const availableNumbers = Array(90).fill(null).map((_, i) => i + 1);
    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 5; ++j) {
            let randi;
            do {
                randi = Math.floor(Math.random() * availableNumbers.length);
            } while (randi && ticket[i].some(num => num && Math.floor(num.value / 10) == Math.floor(availableNumbers[randi] / 10)))
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
    coveredRows = [];
    fullHouse = false;
    game;
    constructor(name, id, game) {
        this.id = id;
        this.name = name;
        this.game = game;
    }
    buyTicket() {
        if (this.money > TICKET_COST && !games[this.game].started) {
            this.tickets.push(generateTicket());
            this.money -= TICKET_COST;
        }
    };
    callBingo() {
        // test full house
        let type = ""
        this.tickets.forEach(ticket => {
            if (ticket.every(row => row.every(square => !square || square.covered))) {
                let increase = Math.max(0, 10 - (games[this.game].fullHouses)*2);
                this.money += increase;
                games[this.game].fullHouses++;
                this.fullHouse = true;
                socketIO.emit(`full-house-${this.game}`, {...this, increase});
                type =  "FULL_HOUSE";
            }
            
        })
        if (type.length) return type;
        // test 5 in row
        this.tickets.forEach(ticket => {
            ticket.forEach(row => {
                if (row.every(square => !square || square.covered) && this.coveredRows.every(r => r.join(" ") !== row.join(" "))) {
                    let increase = Math.max(0, 5 - (games[this.game].fiveInRow));
                    this.money += increase;
                    this.coveredRows.push(fullRow);
                    games[this.game].fiveInRow++;
                    socketIO.emit(`five-in-row-${this.game}`, {...this, increase});
                    type = "FIVE_IN_ROW";
                }
            })
        })
        if (!type.length) {
            this.money -= 2;
            socketIO.emit(`false-bingo-${this.game}`, this);
        }
        return type;
    }
}

class Game {
    key;
    fullHouses = 0;
    fiveInRow = 0;
    players = [];
    started = false;
    ended = false;
    enableAutoMark = true;
    availableNumbers = Array(90).fill(null).map((_, i) => i + 1);
    host;
    hostid;
    chat = [];
    timeTillNextCall = 0;
    lastNumberCalled = null;
    constructor(host, hostid, enableAutoMark = true) {
        this.key = generateKey();
        this.host = host;
        this.hostid = hostid;
        this.enableAutoMark = enableAutoMark;
        this.join(host, hostid, this.key);

    }
    join(playername, playerid) {
        this.players.push(new Player(playername, playerid, this.key));
        emitUpdate(this.key);
    }
    start() {
        if (!this.started) {
            this.started = true;
            this.timeTillNextCall = 5;
            emitUpdate(this.key)
            let second = setInterval(() => {
                this.timeTillNextCall--;
                if (this.timeTillNextCall < 0) this.timeTillNextCall = 5;
            }, 1000)
            let numberCall = setInterval(() => {
                this.callNumber();
                if (this.availableNumbers.length <= 0) {
                    clearInterval(numberCall);
                    clearInterval(second);
                    this.ended = true;
                    emitUpdate(this.key);
                    delete games[this.key];
                }
            }, 5000)
            
        }
    }
    callNumber() {
        let randi = Math.floor(Math.random() * this.availableNumbers.length);
        let randnum = this.availableNumbers[randi];
        this.lastNumberCalled = randnum;
        this.availableNumbers.splice(randi, 1);
        if (this.enableAutoMark) {
            this.players.forEach((player, i) => {
                this.players[i].tickets.forEach((ticket, j) => (
                    ticket.forEach((row, k) => row.forEach((square, l) => {
                        if (square && square.value == randnum) {
                        this.players[i].tickets[j][k][l].covered = true;
                        }
                    // return square;
                    }))
                ))
            })
        }
       // emitUpdate(this.key);
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
    const game = new Game(req.query.host, req.query.hostid, req.query.enableAutoMark);
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
    res.send("Started!")
})

app.put("/chat/:key", (req, res) => {
    games[req.params.key].chat.push(req.query);
    emitUpdate(req.params.key);
});

app.put("/buy/:key", (req, res) => {
    for (let i = 0; i < games[req.params.key].players.length; i++) {
        if (games[req.params.key].players[i].id === req.query.playerid) {
            games[req.params.key].players[i].buyTicket();
            break;
        }
    }
    emitUpdate(req.params.key)
});

app.put("/call-bingo/:key", (req, res) => {
    for (let i = 0; i < games[req.params.key].players.length; i++) {
        if (games[req.params.key].players[i].id === req.query.playerid) {
            res.send(games[req.params.key].players[i].callBingo());
            break;
        }
    }
    emitUpdate(this.key);
    
})