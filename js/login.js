"use strict";

const form = document.querySelector('.login-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    // Записываем объект Форм дата в обычный объект для передачи через json
    const object = {};
    formData.forEach((value, key) => {
        object[key] = value;
    }); 

    fetch('php/autorisation.php', {
        method: "POST", 
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(object)
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);

        if (res === true) {
            
            // Делаем переход в лк после успешной авторизации
            document.location = '/account';
        }
    });
});