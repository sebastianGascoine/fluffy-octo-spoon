const { v4: uuidv4 } = require('uuid');

let Player = function(name, color) {
    this.name = name;
    this.uuid = uuidv4();
    this.socket = null;
    this.color = color;
}

module.exports = Player;
