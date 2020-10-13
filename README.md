# BINGO API version 1.0.5
### by Siddhartha Chatterjee

## API URL:
[http://bingo-api-env.eba-zpgsctry.us-west-1.elasticbeanstalk.com/](http://bingo-api-env.eba-zpgsctry.us-west-1.elasticbeanstalk.com/)

## Requests:
### `get /games`
returns list of all games
### `get /games/:key`
returns the game with the specified key param
### `get /games/:key/:prop`
gets a specific property of a specific game
### `post /new?host=...&hostid=...`
creates a new game
### `put /join/:key?name=...&id=...`
admits the player into the game
### `put /chat/:key?from=...&body=...`
sends a chat message
### `put /buy/:key?playerid=...`
buys a ticket

## Socket.io events:
game${key}-updated