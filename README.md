# BINGO API version 1.0.5
### by Siddhartha Chatterjee

## API URL:
[http://bingo-api-env.eba-zpgsctry.us-west-1.elasticbeanstalk.com/](http://bingo-api-env.eba-zpgsctry.us-west-1.elasticbeanstalk.com/)

## Requests:
### get /games
returns list of all games
### get /games/:key
returns the game with the specified key param
### post /join/:key?name=...&id=...
admits the player into the game
### post /chat/:key?from=...&body=...
sends a chat message


## Socket.io events:
game${key}-updated