"use strict";
function active(path, id) {
    const links = document.querySelectorAll('.menu_link');
    links.forEach((item) => {

        const pathname = document.location.pathname;
        if (pathname === path && item.classList.contains(id)) {
            item.classList.toggle('active');
        }
    });
}
active('/', 'home');
active('/registration.php', 'registration');
active('/login.php', 'login');