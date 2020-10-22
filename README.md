# BINGO API version 1.0.5
### by Siddhartha Chatterjee

This project serves as an API for my bingo game.
## API URL:
[http://bingo-api-env.eba-zpgsctry.us-west-1.elasticbeanstalk.com/](http://bingo-api-env.eba-zpgsctry.us-west-1.elasticbeanstalk.com/)

## Requests:
### `get /games`
returns list of all games
### `get /games/:key`
returns the game with the specified key param
### `get /games/:key/:prop`
gets a specific property of a specific game
### `post /new?host=...&hostid=...&enableAutoMark=...`
creates a new game
### `put /join/:key?name=...&id=...`
admits the player into the game
### `put /start/:key`
starts game
### `put /chat/:key?from=...&body=...`
sends a chat message
### `put /buy/:key?playerid=...`
buys a ticket
### `put /call-bingo/:key?playerid=...`
calls bingo, returns result of the call or blank if call was incorrect
### `put /mark/:key?playerid=...ticket=...row=...col=...`
marks a number off on a ticket if enable-auto-mark is false

## Socket.io:

``` js
const API_URL = "http://bingo-api-env.eba-zpgsctry.us-west-1.elasticbeanstalk.com/";
const socket = require("socket.io-client" /* npm install socket.io-client */)(API_URL);

const gameRoom = // whatever the game room is

// when game is updated
socket.on(`game${gameRoom}-updated`, (game /* This is the updated game object */) => {
    /* do something */
});

socket.on(`full-house-${gameRoom}`, (player /* player who scored full house */) => {

});

socket.on(`five-in-row-${gameRoom}`, (player) => {

});

socket.on(`false-bingo-${gameRoom}`, (player) => {

})

```

