function attemptLogin(event) {
    if (event) event.preventDefault();

    $.post('/login', {
        username: $('#username').val(),
        password: $('#password').val()
    }, function (data) {
        if (data.error) return Swal.fire({ icon: 'error', title: 'Error', text: data.errorMessage });

        window.location = data.redirect;
    });

    return false;
}

$(document).ready(function() {
    $('#username').keydown((event) => {
        if (event.which === 13) return attemptLogin(event);
    });

    $('#password').keydown((event) => {
        if (event.which === 13) return attemptLogin(event);
    });

    $('#submit').click(() => {
        return attemptLogin();
    });
});
