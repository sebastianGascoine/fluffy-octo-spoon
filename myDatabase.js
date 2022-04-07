
const Student = require('./Game');
let myDatabase = function() {
    this.board = new Array(8).fill(0).map(() => new Array(8).fill(0));
    this.games = [];
    
}

let gameIndex = 0;
/* NON FUNC 
myDatabase.prototype.displayboard = function() {
    for (let i=0;i<this.students.length;i++) {
        for (let b=0;b<this.students.length;b++){
        console.log(this.students[i][b]);
    }
    }
}*/
//similar to create in routes
myDatabase.prototype.newGame = function(game) {
  for (let i=0;i<this.games.length;i++) {
    if (this.games[i] && this.games[i].id == game.id) {
      return false;
    }
  }
    this.games[gameIndex++] = new game(game.id,game.players,game.board,game.moves);
    return true;
}
//similar to read
myDatabase.prototype.getGame = function(id) {
  for (let i=0;i<this.games.length;i++) {
    if (this.games[i] && id == this.games[i].id)
        {
      return(new game(this.games[i].id,this.games[i].players,this.games[i].board,this.games[i].moves));
        }
  }
    return null;
}
//similar to update
myDatabase.prototype.putGame = function(game) {
  for (let i=0;i<this.games.length;i++) {
    if (this.games[i] && this.games[i].id == game.id) {
      this.games[i] = new game(game.id, game.players, game.board, game.moves);
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
