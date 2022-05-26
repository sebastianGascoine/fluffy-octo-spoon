<<<<<<< HEAD


function userClicked(){
    console.log("login userClicked")
    $.post("/login",{username:$("#username").val(), password:$("#psw").val()},function(data)
    {
        console.log("login callback function")
        window.location = data.redirect;
    });

    return false;
}


$(document).ready(function(){

    $("#username").keydown( function( event ) {
        if ( event.which === 13 ) {
            userClicked();
            event.preventDefault();
            return false;
        }
    });

    $("#psw").keydown( function( event ) {
        if ( event.which === 13 ) {
            userClicked();
            event.preventDefault();
            return false;
        }
    });

    $('#submit').click(function(event) {
        if ( event.which === 13 ) {
            userClicked();
            event.preventDefault();
            return false;
        }``
    });
});