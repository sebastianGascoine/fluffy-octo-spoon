$(document).ready(function() {
    let cell = 0;

    for (let r = 0; r < 8; ++r) {
        const row = $("#board").append('<tr></tr>');

        for (let r = 0; r < 8; ++r) {
            $(row).append(`<td class="cell${cell % 2}"></td>`);

            cell++;
        }

        cell++;
    }
});
