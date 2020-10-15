/* Siddhartha Chatterjee
 * __________________
 * @Copyright Siddhartha Chatterjee
 *  [2020] - [2025] Siddhartha Chatterjee
 *  All Rights Reserved.
 * 
 * NOTICE:  All information contained herein is, and remains
 * the property of Siddhartha Chatterjee,
 * The intellectual and technical concepts contained
 * herein are proprietary to Siddhartha Chatterjee
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Siddhartha Chatterjee.
 */
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