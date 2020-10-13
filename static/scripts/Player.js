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

module.exports = Player;