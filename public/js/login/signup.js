

function userClicked(){
    console.log("signup userClicked")


    $.post("/signup",{username:$("#username").val(), password:$("#psw").val()},function(data)
    {
        console.log("signup callback function")
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

});


