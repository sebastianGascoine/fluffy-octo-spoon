function attemptCreate(gameID, fenString) {
    console.log(gameID);

    $.ajax({
        url: "/create",
        type: "POST",
        data: { gameID, fenString },
        success: function (data) {
            if (data.error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.errorMessage,
                });
                return;
            }

            attemptJoin(gameID);
        },
        dataType: "json",
    });
}

function attemptJoin(gameID) {
    $.ajax({
        url: "/join",
        type: "POST",
        data: { gameID },
        success: function (data) {
            if (data.error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.errorMessage,
                });
                return;
            }

            window.location.href = "/board?game=" + gameID;
        },
        dataType: "json",
    });
}

$(document).ready(function() {
    $('#logout-button').click(function() {
        $.get('/logout', function(data) {
            window.location = data.redirect;
        });
        return false;
    });

    $('#create-game').click(function() {
        $.post('/create', {}, function(data) {
            if (data.error) return alert('Error!');

            window.location = data.redirect;
        });
        return false;
    });

    $('#open-join').click(function() {
        $('#join-state').css('display', 'block');
        $('#create-state').css('display', 'none');
        $('#load-state').css('display', 'none');
    });

    $('#open-create').click(function() {
        $('#join-state').css('display', 'none');
        $('#create-state').css('display', 'block');
        $('#load-state').css('display', 'none');
    });

    $('#open-load').click(function() {
        $('#join-state').css('display', 'none');
        $('#create-state').css('display', 'none');
        $('#load-state').css('display', 'block');
    });

    $('#join-state input[name=submit]').click(function(event) {
        const gameID = $('#join-state input[name=gameID]').val();

        attemptJoin(gameID);

        event.preventDefault();
        return false;
    });

    $('#create-state input[name=submit]').click(function(event) {
        const gameID = $('#create-state input[name=gameID]').val();

        attemptCreate(gameID, '');

        event.preventDefault();
        return false;
    });

    $('#load-state input[name=submit]').click(function(event) {
        const gameID = $('#load-state input[name=gameID]').val();
        const string = $('#load-state input[name=string]').val();

        attemptCreate(gameID, string);

        event.preventDefault();
        return false;
    });
});