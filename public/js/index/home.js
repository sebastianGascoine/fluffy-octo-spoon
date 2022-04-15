/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function joinVis() {
    console.log('join')
    // await sleep(2000);
    $("#2").removeClass("active"); //
    $("#1").toggleClass("active");
    $("#3").removeClass("active");
}

function createVis() {
    console.log("create");
    //  await sleep(2000);
    $("#1").removeClass("active");
    $("#3").toggleClass("active");
    $("#2").removeClass("active"); //
}

function fenVis() {
    console.log('import')
    //await sleep(2000);
    $("#1").removeClass("active");
    $("#2").toggleClass("active");
    $("#3").removeClass("active");
}
let isdark = true;

function lightdark() {

    console.log('here');

    if (isdark) {
        console.log(isdark);

        $("#image").attr("src", "./../resources/logoDark.svg");
        $('.darkmode').css("color", "black");
        $('.darkmode').css("background-color", "white");
        $('.darkBordered').css("border", "2px solid black");

    } else {
        console.log(isdark);
        $("#image").attr("src", "./../resources/logo.svg");
        $('.darkmode').css("color", "white");
        $('.darkmode').css("background-color", "black");
        $('.darkBordered').css("border", "2px solid white");
    }

  //  $("#body_main").toggleClass("lightmode");


  //  $("#body_main").toggleClass("darkmode");

    isdark = !isdark;

}

function join() {
    const gameID = $('#joinInput').val();
    const name = $('#playerNameJoin').val();

    window.location.href = '/play?gameID=' + gameID + '&name=' + name;
}

function create() {
    const gameID = $('#gameIdCreate').val();
    const name = $('#playerNameCreate').val();

    $.ajax({
        url: "/create",
        type: "POST",
        data: { gameID, name },
        success: function(data) {
            if (data.error) {
                alert('errorrrrrrrrrrrr');
                return;
            }

            window.location.href = '/play?gameID=' + gameID + '&name=' + name + '&imported=' + 'n';
        },
        dataType: "json"
    });
}

function createFEN() {
    alert('createFEN');
    const gameID = $('#gameIdImport').val();
    const name = $('#playerNameImport').val();
    const fen = $('#fenInputImport').val();
    $.ajax({
        url: "/createfen",
        type: "POST",
        data: { gameID, name, fen },
        success: function(data) {
            if (data.error) {
                alert('errorrrrrrrrrrrr');
                return;
            }

            window.location.href = '/play?gameID=' + gameID + '&name=' + name +'&imported=' + 'y';
        },
        dataType: "json"
    });

}

$(document).ready(function() {
    $("#image").attr("src", "./../resources/logo.svg")

    console.log('cheese');
});
