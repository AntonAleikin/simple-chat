"use strict";

const form = document.querySelector(".registration__form"),
pass = form.querySelector('.registration__pass');

// Класс вывода оповещений о валидности данных, заполняемых в форме 
class validationMessage {
    constructor (message, style, neighbour, copy) {
        this.message = message;
        this.style = style;
        this.neighbour = neighbour;
        this.copy = copy;
        this.render();
    }
    render() {
        const message = document.createElement('div');
        this.neighbour.after(message);
        message.classList.add(this.copy);
        message.classList.add(this.style);
        message.innerText = this.message;

        // Удаляем копии 
        if (message.nextElementSibling.classList.contains(this.copy)) {
            message.nextElementSibling.remove();
            this.neighbour.after(message);
            message.classList.add(this.copy);
            message.classList.add(this.style);
            message.innerText = this.message;
        } 
    }
}

// Проверяем пароль на сложность: числа, буквы и повторы
pass.addEventListener("input", ()=>{
    const passValue = pass.value;

    // Записываем буквы и их кол-во в массив
    let sums = {};
    passValue.split('').map(function(e){
        sums[e] = !sums[e] ? 1 : sums[e]+1;
    });
    // Наполняем массив значениями кол-ва повторов букв, чтобы потом проверить макс к-во повторов через Math.max()
    let arr = [];
    for (let key in sums) {
        arr.push(sums[key]);
    }

    // <= 8 И больше 2 повторов || ((>= 8 < 12) || >= 12), все есть, но больше 2 повторов 
    if (((Math.max(...arr) > 2 || passValue.match(/[a-z]/) || passValue.match(/[0-9]/) || 
    passValue.match(/[A-Z]/)) && passValue.length <= 8) || (Math.max(...arr) > 2 && passValue.match(/[a-z]/) && 
    passValue.match(/[A-Z]/) && passValue.match(/[0-9]/) && 
    ((passValue.length >= 8 && passValue.length < 12) || passValue.length >= 12))) {  

        const validation = new validationMessage(
            'У вас ненадежный пароль!',
            'red',
            pass,
            'copy'
        );
    } 
    // >= 8 < 12, НЕ больше 2 повторов любых символов, все есть || >= 12, макс 3 повтора, все есть 
    if (((Math.max(...arr) == 1 || Math.max(...arr) == 2) && passValue.match(/[a-z]/) && 
    passValue.match(/[0-9]/) && passValue.match(/[A-Z]/) && passValue.length >= 8 && passValue.length < 12) || 
    (Math.max(...arr) == 3 && passValue.match(/[a-z]/) && 
    passValue.match(/[A-Z]/) && passValue.match(/[0-9]/) && passValue.length >= 12)) {

        const validation = new validationMessage(
            'Пароль средней надежности',
            'yellow',
            pass,
            'copy'
        ); 
    }
    // >= 12, НЕ больше 2 повторов любых символов, все есть
    if ((Math.max(...arr) == 1 || Math.max(...arr) == 2) && passValue.match(/[a-z]/) && 
    passValue.match(/[A-Z]/) && passValue.match(/[0-9]/) && passValue.length >= 12) {
 
        const validation = new validationMessage(
            'У вас надежный пароль!',
            'green',
            pass,
            'copy'
        ); 
    }
});

form.addEventListener("submit", (e)=>{
    // Убираем стандартное поведение браурера. Чтобы ст не обновлялась, после отправки
    e.preventDefault();

    // Жестко задаем отправку формы, только после выполнения условий: >= 8, англ символы и хотя бы 1 число
    const passValue = pass.value;
    if (passValue.length >= 8 && passValue.match(/[a-z]/) && passValue.match(/[0-9]/)) {

        const request = new XMLHttpRequest();
        request.open("POST", "php/registration.php");

        const formData = new FormData(form);
        request.send(formData);

        // Отслеживаем загрузку 
        request.addEventListener("load", ()=>{
            if (request.status === 200) {
                // Очищаем форму спустя 2 сек
                form.reset();
                setTimeout(()=>{}, 2000);

                const submitMessage = 'Поздравляем, вы успешно зарегистрировались!';
                const validation = new validationMessage(
                    submitMessage,
                    'green',
                    form.querySelector('button'),
                    'copy'
                );
            }
        });
    } else {
        const errorMessage = 'Не удалось отправить форму. Пожалуйста, проверьте правильность написания'+ 
        ' логина и пароля. Пароль должен состоять только из латинских символов и хотя бы одной цифры.'+ 
        ' Длина пароля должна быть не менее 8 символов.';

        const validation = new validationMessage(
            errorMessage,
            'red',
            form.querySelector('button'),
            'copy'
        );
    }
});