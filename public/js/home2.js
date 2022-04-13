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
