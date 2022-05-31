function userClicked() {
    console.log("signup userClicked");

    $.post(
        "/signup",
        {username: $("#username").val(), password: $("#psw").val()},
        function (data) {
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
        }
    );
    return false;
}

$(document).ready(function (event) {

    $("#username").keypress(function (event) {
        console.log("code doo doo");
        if (event.which === 13) {
            userClicked();
            event.preventDefault();
            return false;
        }
    });

    $("#psw").keypress(function (event) {
        //console.log("code doo doo " + event.which);
        if (event.which === 13) {
            userClicked();
            event.preventDefault();
            return false;
        } else {
            //console.log(event.which)
        }
    });
    $('#submit').click(function (event) {
        console.log("code doo doo");
        if (event.which === 1) {
            userClicked();
            event.preventDefault();
            return false;
        } else {
            console.log(event.which)
        }
    });
});
