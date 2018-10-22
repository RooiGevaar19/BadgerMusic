//jshint esversion:6, node:true

$(() => {
    $(".rem").click(function(ev) {
        if (!confirm("Are you sure you want to delete your account?\nIt will be lost forever and ever!")) {
            ev.preventDefault();
        }
    });

    $(".mod").click(function(ev) {
        if (!confirm("Are you sure you want to change information of your account?")) {
            ev.preventDefault();
        }
    });

    $(".cha").click(function(ev) {
        if (!confirm("Are you sure you want to change your password?")) {
            ev.preventDefault();
        }
    });

    $(".cha2").click(function(ev) {
        if (!confirm("Are you sure you want to change your avatar?")) {
            ev.preventDefault();
        }
    });
});