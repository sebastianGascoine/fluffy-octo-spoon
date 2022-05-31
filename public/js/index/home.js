function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function joinVis() {
<<<<<<< HEAD
    $("#2").removeClass("active"); //
    $("#1").toggleClass("active");
    $("#3").removeClass("active");
}

function createVis() {
    $("#1").removeClass("active");
    $("#3").toggleClass("active");
    $("#2").removeClass("active"); //
}

function fenVis() {
    $("#1").removeClass("active");
    $("#2").toggleClass("active");
    $("#3").removeClass("active");
=======
  $("#2").removeClass("active"); //
  $("#1").toggleClass("active");
  $("#3").removeClass("active");
  $.get("/userInfo",function(data){
  console.log("session get userInfo function callback");
  if (data.name){
    $("#playerNameJoin").val(data.name);
  }
  });

}

function createVis() {
  $("#1").removeClass("active");
  $("#3").toggleClass("active");
  $("#2").removeClass("active"); //
  $.get("/userInfo",function(data){
  console.log("session get userInfo function callback");
  if (data.name){
    $("#playerNameCreate").val(data.name);
  }
  });

}

function fenVis() {
  $("#1").removeClass("active");
  $("#2").toggleClass("active");
  $("#3").removeClass("active");
  $.get("/userInfo",function(data){
  console.log("session get userInfo function callback");
  if (data.name){
    $("#playerNameImport").val(data.name);
  }
  });

>>>>>>> d871ab553c674171b3826f3e03c4ec7ea2ef40b8
}

let isdark = true;

function lightdark() {
    if (isdark) {
        $("#image").attr("src", "resources/logoDark.svg");
        $(".darkmode").css("color", "black");
        $(".darkmode").css("background-color", "white");
        $(".darkBordered").css("border", "2px solid black");
    } else {
        $("#image").attr("src", "resources/logo.svg");
        $(".darkmode").css("color", "white");
        $(".darkmode").css("background-color", "black");
        $(".darkBordered").css("border", "2px solid white");
    }

    isdark = !isdark;
}

function joinButton() {
    const gameID = $("#joinInput").val();
    const name = $("#playerNameJoin").val();

    attemptJoin(gameID, name);
}

function createButton() {
    const gameID = $("#gameIdCreate").val();
    const name = $("#playerNameCreate").val();

    attemptCreate(
        gameID,
        name,
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    );
}

function importButton() {
    const gameID = $("#gameIdImport").val();
    const name = $("#playerNameImport").val();
    const fen = $("#fenInputImport").val();

    attemptCreate(gameID, name, fen);
}

function attemptCreate(gameID, name, fen) {
    $.ajax({
        url: "/create",
        type: "POST",
        data: {gameID, name, fen},
        success: function (data) {
            if (data.error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.errorMessage,
                });
                return;
            }

            attemptJoin(gameID, name);
        },
        dataType: "json",
    });
}

function attemptJoin(gameID, name) {
    $.ajax({
        url: "/join",
        type: "POST",
        data: {gameID, name},
        success: function (data) {
            if (data.error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.errorMessage,
                });
                return;
            }

            window.location.href = "/board?game=" + gameID + "&code=" + data.code;
        },
        dataType: "json",
    });
}

$(document).ready(function () {
    $("#image").attr("src", "./../resources/logo.svg");
});
