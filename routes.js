let path = require("path");
let express = require("express");
const chess = require('chess.js');
let myDatabase = require("./myDatabase");
const Student = require('./Game');


//Look at below web page for info on express.Router()
//https://scotch.io/tutorials/learn-to-use-the-new-router-in-expressjs-4
let router = express.Router();

//request is info sending to server from client.
//response is info sending to client from server.

router.get("/",function(req,res){
    res.sendFile(path.resolve(__dirname + "/public/views/load.html"));  //changed
});
//////////////////////////////////////////////////////////////
let index = 0;
database = new myDatabase();

//new code good
router.post('/create', function(req, res){
   let identifier = Number(req.body.identifier.trim());
   let player = String(req.body.name.trim());
   

    if (identifier == "") {
        res.json({error:true});
        return;
    }
    if (Number.isNaN(identifier)) {
        res.json({error:true});
        return;
    }

    if (name == "") {
        res.json({error:true});
        return;
    }
//keep above
    console.log("create id = " + identifier);
    console.log("create name = " + name);

    database.postStudent(new Student(Number(identifier),String(name)));
    database.displayStudents();
    res.json({error:false});
});
//new code good
router.get('/read', function(req, res){

    let identifier = Number(req.query.identifier.trim());

    if (req.query.identifier == "") { //empty id
        res.json({error:true});
        return;
    }
    if (Number.isNaN(identifier)) { //if id is not a #
        res.json({error:true});
        return;
    }


    if(database.getStudent(identifier) != null){ //if id input is already in database
      tempRead = database.getStudent(identifier);

      let drives = String(tempRead.drives);
      let booldrives = (drives.toLowerCase() === 'true'); //returns true
      console.log("read id = " + tempRead.id);
      console.log("read name = " + tempRead.name);
      res.json({error:false,name:tempRead.name});
      return;
    } else{
      res.json({error:true});
    }

});
router.get('/join', function(req, res){

    let identifier = Number(req.query.identifier.trim());

    if (req.query.identifier == "") { //empty id
        res.json({error:true});
        return;
    }
    if (Number.isNaN(identifier)) { //if id is not a #
        res.json({error:true});
        return;
    }


    if(database.getStudent(identifier) != null){ //if id input is already in database
      tempRead = database.getStudent(identifier);

      let drives = String(tempRead.drives);
      let booldrives = (drives.toLowerCase() === 'true'); //returns true
      console.log("read id = " + tempRead.id);
      console.log("read name = " + tempRead.name);
      res.json({error:false,name:tempRead.name});
      return;
    } else{
      res.json({error:true});
    }

});
//new code good
router.put('/update', function(req, res){
   let identifier = Number(req.body.identifier.trim());
   let name = String(req.body.name.trim());
   let grade = Number(req.body.grade.trim());
   let drives = req.body.drives;

    if (req.body.identifier == "") {
        res.json({error:true});
        return;
    }
    if (Number.isNaN(identifier)) {
        res.json({error:true});
        return;
    }

    if (name == "") {
        res.json({error:true});
        return;
    }
//keep above
    if(database.putStudent(new Client(identifier,name,grade,drives))){ //if id input is already in database
      console.log("update id = " + identifier);
      console.log("update name = " + name);
      res.json({error:false});
      return;
    } else{
      res.json({error:true});
    }
});
//new code
router.delete('/delete/:identifier', function(req, res){
   let identifier = Number(req.params.identifier.trim());

    if (identifier == "") {
        res.json({error:true});
        return;
    }
    if (Number.isNaN(identifier)) {
        res.json({error:true});
        return;
    }
    if(database.getStudent(identifier) != null){
      database.deleteStudent(identifier);
      console.log('deleted student');
      res.json({error:false});
      return;
    }
    res.json({error:true});
});

module.exports = router;

//old create
/*
router.post('/create', function(req, res){
   let identifier = Number(req.body.identifier.trim());
   let name = String(req.body.name.trim());
   index = array.length;

    if (req.body.identifier == "") {
        res.json({error:true});
        return;
    }
    if (Number.isNaN(identifier)) {
        res.json({error:true});
        return;
    }

    if (name == "") {
        res.json({error:true});
        return;
    }
    for(let j of array)
    {
      if(j.id == identifier){ //if id input is already in database
        res.json({error:true});
        return;
      }
    }

    console.log("id = " + identifier);
    console.log("name = " + name);
    console.log("index = " + index);
    array[index++] = new Client(identifier,name);
    res.json({error:false});
});  //good old code
*/
//old read
/*
router.get('/read', function(req, res){

    let identifier = Number(req.query.identifier.trim());

    if (req.query.identifier == "") { //empty id
        res.json({error:true});
        return;
    }
    if (Number.isNaN(identifier)) { //if id is not a #
        res.json({error:true});
        return;
    }

    for(let j of array)
    {
      if(j.id == identifier){ //if any array ids = input id print
        console.log("read id = " + j.id);
        console.log("read name = " + j.name);
        res.json({error:false,name:j.name});
        return;
      }
    }
    res.json({error:true});

}); //good
*/
//old update
/*
router.put('/update', function(req, res){
  let identifier = Number(req.body.identifier.trim());
  let name = String(req.body.name.trim());


  if (req.body.identifier == "") {
      res.json({error:true});
      return;
  }
  if (Number.isNaN(identifier)) {
      res.json({error:true});
      return;
  }

  if (name == "") {
      res.json({error:true});
      return;
  }
  for(let j of array)
  {
    if(j.id == identifier){ //if id input is already in database
      j.name = name;
      console.log("id = " + identifier);
      console.log("name = " + name);
      res.json({error:false});
      return;
    }
  }
  res.json({error:true});
});
*/
//old delete
/*
router.delete('/delete/:identifier', function(req, res){
   let identifier = Number(req.params.identifier.trim());

    if (req.body.identifier == "") {
        res.json({error:true});
        return;
    }
    if (Number.isNaN(identifier)) {
        res.json({error:true});
        return;
    }

    for(let j of array)
    {
      if(j.id == identifier){ //sorts out everything that match id
        array = array.filter(idf => idf.id != identifier);
        console.log(array);
        res.json({error:false});
        return;
      }
    }
    res.json({error:true});

});
*/
