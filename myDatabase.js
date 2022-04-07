
const Student = require('./Game');
//import { Chess } from 'chess.js'

let myDatabase = function() {
    this.board = new Array(8).fill(0).map(() => new Array(8).fill(0));
    this.games = [];
    
}

let studentIndex = 0;

myDatabase.prototype.displayboard = function() {
    for (let i=0;i<this.students.length;i++) {
        for (let b=0;b<this.students.length;b++){
        console.log(this.students[i][b]);
    }
    }
}
//similar to create in routes
myDatabase.prototype.postGame = function(game) {
  for (let i=0;i<this.games.length;i++) {
    if (this.games[i] && this.students[i].id == student.id) {
      return false;
    }
  }
    this.students[studentIndex++] = new Student(student.id,student.name,student.grade,student.drives);
    return true;
}
//similar to read
myDatabase.prototype.getStudent = function(id) {
  for (let i=0;i<this.students.length;i++) {
    if (this.students[i] && id == this.students[i].id)
        {
      return(new Student(this.students[i].id,this.students[i].name,this.students[i].grade,this.students[i].drives));
        }
  }
    return null;
}
//similar to update
myDatabase.prototype.putStudent = function(student) {
  for (let i=0;i<this.students.length;i++) {
    if (this.students[i] && this.students[i].id == student.id) {
      this.students[i] = new Student(student.id,student.name,student.grade,student.drives);
      return true;
    }
  }
  return false;
}
//delete student
myDatabase.prototype.deleteStudent = function(id) {
  for (let i=0;i<this.students.length;i++) {
    if (this.students[i] && id == this.students[i].id) {
              let tempPtr = this.students[i];
        this.students[i] = undefined;
                return tempPtr;
    }
  }
    return null;
}

module.exports = myDatabase;
