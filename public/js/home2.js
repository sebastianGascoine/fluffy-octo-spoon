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
isdark = true;

function lightdark() {

    console.log('here');

    if (isdark = true) {

        $("img")

    } else if (isdark = false) {

    }

    //  $("#body_main").removeClass("darkmode");
    $("#body_main").toggleClass("lightmode");
    $("#btn").toggleClass("lightmode");
    $("#btn").toggleClass("darkmode");


    // $("#body_main").removeClass("lightmode");
    $("#body_main").toggleClass("darkmode");

}