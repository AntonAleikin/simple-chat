"use strict";

function active(path, id) {
    const links = document.querySelectorAll('.menu__link');

    links.forEach((link) => {
    
        if (window.matchMedia('(min-width: 768px)').matches) {
    
            const pathname = document.location.pathname;
            if (pathname === path && link.classList.contains(id)) {
                link.classList.toggle('active');
            } 
        } else {
            link.classList.remove('active');
        }
    });
}
active('/', 'menu__link-home');
active('/chat.php', 'menu__link-chat');
active('/registration.php', 'menu__link-registration');
active('/login.php', 'menu__link-login');


// Гамбургер
function hamburger () { 
    if (window.matchMedia('(max-width: 767px)').matches) {

        const hamburger = document.querySelector('.hamburger'),
        menu = document.querySelector('.menu'),
        links = document.querySelectorAll('.menu__link');

        // Открываем/закрываем меню, при клике на гамбургер
        hamburger.addEventListener("click", (e) => {

            if (!hamburger.classList.contains('hamburger-active') && !menu.classList.contains('menu-active')) {

                hamburger.classList.toggle('hamburger-active');
                menu.classList.toggle('menu-active');
            } else {
    
                hamburger.classList.toggle('hamburger-active');
                menu.classList.toggle('menu-active');
            }
        });

        // После перехода по ссылке - сначала закрываем меню, а потом переходим по ссылке
        links.forEach((link) => {

            link.addEventListener("click", (e) => {
                e.preventDefault();

                hamburger.classList.toggle('hamburger-active');
                menu.classList.toggle('menu-active');

                // Ждем время анимации и переходим по ссылке
                setTimeout(() => {
                    document.location = e.target.href;
                }, 300);
            });
        }); 
    }
}
hamburger();