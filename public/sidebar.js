//jshint esversion:6, node:true
/* globals io: false */

$(() => {
    let x = document.getElementById("sidebarid");
    if (x) x.style.display = "none";

    let toggleSidebar = function(event) {
        let x = document.getElementById("sidebarid");
        if (x.style.display === "none") {
            x.style.display = "flex";
        } else {
            x.style.display = "none";
        }
        event.preventDefault();
    };  

    $("#showsidebar").click(toggleSidebar);
    $("#hidesidebar").click(toggleSidebar);
});