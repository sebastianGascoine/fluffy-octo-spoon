function attemptSignup(event) {
    if (event) event.preventDefault();
    
    $.post('/signup', {
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
        if (event.which === 13) return attemptSignup(event);
    });

    $('#password').keydown((event) => {
        if (event.which === 13) return attemptSignup(event);
    });

    $('#submit').click(() => {
        return attemptSignup();
    });
});
