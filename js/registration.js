"use strict";

const form = document.querySelector(".registration__form");

form.addEventListener("submit", (e)=>{
    // Убираем стандартное поведение браурера. Чтобы ст не обновлялась, после отправки
    e.preventDefault();

    const request = new XMLHttpRequest();
    request.open("POST", "php/registration.php");

    // Заголовок мы не устанавливаем! Он устанавливается атвоматом, когда Form-data + XMLHttpRequest
    //request.setRequestHeader("Content-type", "multipart/form-data");

    const formData = new FormData(form);
    request.send(formData);

    // Отслеживаем загрузку 
    request.addEventListener("load", ()=>{
        if (request.status === 200) {
            // Очищаем форму спустя 2 сек
            form.reset();
            setTimeout(()=>{}, 2000);
        }
    });
});