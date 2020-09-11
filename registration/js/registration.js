"use strict";

const form = document.querySelector(".registration__form"),
pass = form.querySelector('.registration__pass'),
username = form.querySelector('.registration__username');


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
        this.neighbour.value.trim(); // Удаляем пробелы 

        // Удаляем копии, из-за события инпут
        if (message.nextElementSibling.classList.contains(this.copy)) {
            message.nextElementSibling.remove();
        } 
    }
}


// Проверка на занятость логина и исключение Кирилицы
const usernameCheck = {};
username.addEventListener("input", (e) => {
    e.preventDefault();
    const usernameValue = username.value;

    // Не включаем Кирилицу и только в этом случае отправляем запрос
    if ((usernameValue.match(/[а-я]/) || usernameValue.match(/[А-Я]/)) || username.value.length < 5) {
        const validation = new validationMessage(
            'Логин должен содержать не меньше 5 латинских символов',
            'red',
            username,
            'copy'
        );
    } else {

        // Асинхронно проверяем на сервере свободен ли логин
        fetch('php/user_check.php', {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(usernameValue)
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            usernameCheck.status = response;
            if (response) {
                console.log(usernameCheck.status);
                const validation = new validationMessage(
                    'Имя пользователя уже существует',
                    'red',
                    username,
                    'copy'
                );
            } else if (username.nextElementSibling.classList.contains('copy')) {
                username.nextElementSibling.remove();
            } 
        })
        .catch(error => console.log(error));
    }

    // Удаляем смс о валидности, если все символы удалены из поля
    if (usernameValue == '' && username.nextElementSibling.classList.contains('copy')) {
        username.nextElementSibling.remove();
    }
});


// Валидация пароля: числа, буквы и повторы
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

    // Не включаем Кирилицу 
    if (passValue.match(/[а-я]/) || passValue.match(/[А-Я]/)) {
        const validation = new validationMessage(
            'Пароль может содержать только латинские символы',
            'red',
            pass,
            'copy'
        );
    }

    // <= 8 И больше 2 повторов || ((>= 8 < 12) || >= 12), все есть, но больше 2 повторов. НЕ включаем Кирилицу
    if (((Math.max(...arr) > 2 || passValue.match(/[a-z]/) || passValue.match(/[0-9]/) || 
    passValue.match(/[A-Z]/)) && passValue.length <= 8 && !passValue.match(/[а-я]/) && !passValue.match(/[А-Я]/)) || 
    (Math.max(...arr) > 2 && passValue.match(/[a-z]/) && passValue.match(/[A-Z]/) && passValue.match(/[0-9]/) && 
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

    // Удаляем смс о валидности, если все символы удалены из поля
    if (passValue == '' && pass.nextElementSibling.classList.contains('copy')) {
        pass.nextElementSibling.remove();
    }
});


// Регистрация
form.addEventListener("submit", (e)=>{
    // Убираем стандартное поведение браурера. Чтобы ст не обновлялась, после отправки
    e.preventDefault();

    /* 
    Жестко задаем отправку формы, только после выполнения условий: 
    Логин: >= 5, англ символы И нет совпадений в базе данных
    Пароль: >= 8, англ символы и хотя бы 1 число 
    */
    const passValue = pass.value, 
    usernameValue = username.value;
    if (!usernameCheck.status && usernameValue.length >= 5 && usernameValue.match(/[a-z]/) && 
    passValue.length >= 8 && passValue.match(/[a-z]/) && passValue.match(/[0-9]/)) {

        const formData = new FormData(form);
        // Записываем объект Форм дата в обычный объект для передачи через json
        const object = {};
        formData.forEach(function(value, key) {
            object[key] = value;
        });
    
        fetch('php/user_creation.php', {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(object)
            
        })
        .then(res => res.json())
        .then(res => {
            if (res) {
                console.log(res);
                // Очищаем форму и смс о валидности пароля спустя 2 сек
                setTimeout(()=>{
                    form.reset();
                    pass.nextElementSibling.remove();
                }, 2000);
    
                const validation = new validationMessage(
                    'Поздравляем, вы успешно зарегистрировались!',
                    'green',
                    form.querySelector('button'),
                    'copy'
                );
            } else {
                console.log(res);
                setTimeout(()=>{
                    pass.nextElementSibling.remove();
                }, 2000);
    
                const validation = new validationMessage(
                    'Что-то пошло не так.. Попробуйте, пожалуйста, позже',
                    'green',
                    form.querySelector('button'),
                    'copy'
                );
            }
        })
        .catch(error => {
            console.log(error);
            setTimeout(()=>{
                pass.nextElementSibling.remove();
            }, 2000);

            const validation = new validationMessage(
                'Что-то пошло не так.. Попробуйте, пожалуйста, позже',
                'green',
                form.querySelector('button'),
                'copy'
            );
        });
        
    } else {
        if (usernameCheck.status) {
            const errorMessage = 'Не удалось отправить форму. Данное имя пользователя уже существует.';

            const validation = new validationMessage(
                errorMessage,
                'red',
                form.querySelector('button'),
                'copy'
            );
        }
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