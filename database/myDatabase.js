const Game = require('./Game');

let myDatabase = function() {
    this.board = new Array(8).fill(0).map(() => new Array(8).fill(0));
    this.games = [];

}
/*
 * .newgame(obj)[.id /.players(string [names separated by a '/' ] ) /.board(FEN string)]
 * .getgame(id)
 * .putgame(obj)[.id /.players(string)[names separated by a '/' ] /.board(FEN string)]
 * .deletegame(id)
 * .getPlayers(id) returns 2 string values
 * .getboard(id)  returns FEN string
 */

let gameIndex = 0;

myDatabase.prototype.newGame = function(game) {
  for (let i=0;i<this.games.length;i++) {
    if (this.games[i] && this.games[i].id == game.id) {
      return false;
    }
  }
    this.games[gameIndex++] = new Game(game.id,game.players,game.board,game.computer,game.maximum);
    return true;
}
//similar to read
myDatabase.prototype.getGame = function(id) {
  for (let i=0;i<this.games.length;i++) {
    if (this.games[i] && id == this.games[i].id)
        {
      return(new Game(this.games[i].id,this.games[i].players,this.games[i].board,this.games[i].computer,this.games[i].maximum));
        }
  }
    return null;
}
myDatabase.prototype.getPlayers = function(id) {
  for (let i=0;i<this.games.length;i++) {
    if (this.games[i] && id == this.games[i].id) {
      return this.games[i].players;
    }
  }
    return null;
}
myDatabase.prototype.getBoard = function(id) {
  for (let i=0;i<this.games.length;i++) {
    if (this.games[i] && id == this.games[i].id)
        {
      return(String(new Game(this.games[i].board)));
        }
  }
    return null;
}
//similar to update
myDatabase.prototype.putGame = function(game) {
  for (let i=0;i<this.games.length;i++) {
    if (this.games[i] && this.games[i].id == game.id) {
      this.games[i] = new Game(game.id, game.players, game.board, game.computer, game.maximum);
      return true;
    }
  }
  return false;
}
//delete student
myDatabase.prototype.deleteGame = function(id) {
  for (let i=0;i<this.games.length;i++) {
    if (this.games[i] && id == this.games[i].id) {
              let tempPtr = this.games[i];
        this.games[i] = undefined;
                return tempPtr;
    }
  }
    return null;
}

module.exports = myDatabase;
