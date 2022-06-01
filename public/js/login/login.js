function userClicked() {
    console.log("login userClicked")
    $.post("/login", {username: $("#username").val(), password: $("#psw").val()}, function (data) {
            if (data.error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.errorMessage,
                });
                return;
            }

            console.log("signup callback function");
            window.location = data.redirect;


    });

    return false;
}


$(document).ready(function () {

    $("#username").keydown(function (event) {
        if (event.which === 13) {
            userClicked();
            event.preventDefault();
            return false;
        }
    });

    $("#pwd").keydown(function (event) {
        if (event.which === 13) {
            userClicked();
            event.preventDefault();
            return false;
        }
    });

    $('#submit').click(function (event) {
        if (event.which === 13) {
            userClicked();
            event.preventDefault();
            return false;
        }
    });
});
