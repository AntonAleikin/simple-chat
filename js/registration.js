"use strict";

const form = document.querySelector(".registration__form"),
pass = form.querySelector('.registration__pass'),
username = form.querySelector('.registration__username'),
email = form.querySelector('.registration__email');


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

// Валидация email и username
function inputValidation (input, check) {

    input.addEventListener("input", (e) => {
        e.preventDefault();

        // Записываем email и username пути к php файлам для чека
        if (input.classList.contains('registration__email')) {
            check.path = 'php/email_check.php';
        } else {
            check.path = 'php/user_check.php';
        }

        //const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        
        // Не включаем Кирилицу + валидація и только в этом случае отправляем запрос  
        const inputValue = input.value;  
        if ((input.classList.contains('registration__email') && !inputValue.match(/@/)) ||
            (input.classList.contains('registration__email') && 
            (inputValue.match(/[а-я]/) || inputValue.match(/[А-Я]/) || inputValue.match(/[A-Z]/) || 
            inputValue.length < 6))) { 

            const validation = new validationMessage(
                'Это поле должно быть заполнено в формате email',
                'red',
                input,
                'copy'
            );
        } else if (input.classList.contains('registration__username') &&
            (inputValue.match(/[а-я]/) || inputValue.match(/[А-Я]/) || inputValue.length < 5)) {

            const validation = new validationMessage(
                'Имя пользователя должно содержать не меньше 5 латинских символов',
                'red',
                input,
                'copy'
            );
        } else {

            // Асинхронно проверяем на сервере свободны ли email и username
            fetch(check.path, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(inputValue)
            })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                check.status = response;
                
                // Выводим оповещения, если email И username существуют
                if (response && input.classList.contains('registration__email')) {
                    console.log(check.status);
                    const validation = new validationMessage(
                        'Пользователь с таким email уже существует',
                        'red',
                        input,
                        'copy'
                    );
                } else if (response && input.classList.contains('registration__username')) {
                    console.log(check.status);
                    const validation = new validationMessage(
                        'Имя пользователя уже существует',
                        'red',
                        input,
                        'copy'
                    );
                } else if (input.nextElementSibling.classList.contains('copy')) {
                    input.nextElementSibling.remove();
                } 
            })
            .catch(error => console.log(error));
        }

        // Удаляем смс о валидности, если все символы удалены из поля
        if (inputValue == '' && input.nextElementSibling.classList.contains('copy')) {
            input.nextElementSibling.remove();
        }
    });
}

// Проверка на занятость имени пользователя и email + исключение Кирилицы
const usernameCheck = {};
inputValidation(username, usernameCheck);

const emailCheck = {};
inputValidation(email, emailCheck);



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

    // Пароль должен содержать не меньше 8 латинских символов и хотя бы одну цифру
    if ((passValue.match(/[a-z]/) || passValue.match(/[A-Z]/) || passValue.match(/[0-9]/)) && 
    passValue.length < 8 && !passValue.match(/[а-я]/) && !passValue.match(/[А-Я]/)) {

        const validation = new validationMessage(
            'Пароль должен содержать не меньше 8 латинских символов и хотя бы одну цифру',
            'red',
            pass,
            'copy'
        );
    }

    if ((passValue.match(/[a-z]/) || passValue.match(/[0-9]/)) && 
    passValue.length >= 8 && !passValue.match(/[а-я]/) && !passValue.match(/[А-Я]/)) {

        const validation = new validationMessage(
            'У вас ненадежный пароль!',
            'red',
            pass,
            'copy'
        );
    }

    // Ухудшение надежного пароля ((>= 8 < 12) || >= 12), все есть, но больше 2 повторов
    if (Math.max(...arr) > 2 && passValue.match(/[a-z]/) && passValue.match(/[A-Z]/) && passValue.match(/[0-9]/) && 
    !passValue.match(/[а-я]/) && !passValue.match(/[А-Я]/) &&
    ((passValue.length >= 8 && passValue.length < 12) || passValue.length >= 12)) {  

        const validation = new validationMessage(
            'У вас ненадежный пароль!',
            'red',
            pass,
            'copy'
        );
    } 

    // >= 8 < 12, НЕ больше 2 повторов любых символов, все есть || >= 12, макс 3 повтора, все есть 
    if ((((Math.max(...arr) == 1 || Math.max(...arr) == 2) && passValue.match(/[a-z]/) && 
    passValue.match(/[0-9]/) && passValue.match(/[A-Z]/) && passValue.length >= 8 && passValue.length < 12) || 
    (Math.max(...arr) == 3 && passValue.match(/[a-z]/) && 
    passValue.match(/[A-Z]/) && passValue.match(/[0-9]/) && passValue.length >= 12))  && 
    !passValue.match(/[а-я]/) && !passValue.match(/[А-Я]/)) {

        const validation = new validationMessage(
            'Пароль средней надежности',
            'yellow',
            pass,
            'copy'
        ); 
    }

    // >= 12, НЕ больше 2 повторов любых символов, все есть
    if ((Math.max(...arr) == 1 || Math.max(...arr) == 2) && passValue.match(/[a-z]/) && 
    passValue.match(/[A-Z]/) && passValue.match(/[0-9]/) && passValue.length >= 12 && 
    !passValue.match(/[а-я]/) && !passValue.match(/[А-Я]/)) {
 
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
    Email: Нет в базе и включает '@'
    Имя пользователя: >= 5, англ символы И нет совпадений в базе данных
    Пароль: >= 8, англ символы и хотя бы 1 число 
    */
    const emailValue = email.value,
    usernameValue = username.value,
    passValue = pass.value;

    if (!emailCheck.status && emailValue.match(/@/) && 
    !usernameCheck.status && usernameValue.length >= 5 && usernameValue.match(/[a-z]/) && 
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

            if (res === true) {
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

            } if (res == 'Пользователь уже существует') {

                const validation = new validationMessage(
                    'Не удалось отправить форму. Пользователь с таким email уже зарегистрирован!',
                    'red',
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
                    'red',
                    form.querySelector('button'),
                    'copy'
                );
            }
        })
        .catch(error => console.log(error));
        

     // Если форма не отправилась и email существует - оповещаем
    } else if (emailCheck.status) {
            
        const validation = new validationMessage(
            'Не удалось отправить форму. Пользователь с таким email уже зарегистрирован',
            'red',
            form.querySelector('button'),
            'copy'
        );

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