const burger = document.getElementById("hamburger");
const menu = document.getElementById("primnav");


burger.addEventListener("click", () => {
    menu.classList.toggle("active");
    document.getElementById("menu-glow").style.opacity = menu.classList[1] == 'active' ? 1 : 0;

});

document.addEventListener("DOMContentLoaded", function() {
    menu.classList.toggle("active");
    document.getElementById("menu-glow").style.opacity = 1;
});