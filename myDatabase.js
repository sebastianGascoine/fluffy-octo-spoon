
const Student = require('./Student');

let myDatabase = function() {
    this.students = [];
}

let studentIndex = 0;

myDatabase.prototype.displayStudents = function() {
    for (let i=0;i<this.students.length;i++) {
        console.log(this.students[i]);
    }
}
//similar to create in routes
myDatabase.prototype.postStudent = function(student) {
  for (let i=0;i<this.students.length;i++) {
    if (this.students[i] && this.students[i].id == student.id) {
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
