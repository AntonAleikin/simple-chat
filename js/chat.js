/* 
Все делаем с помощью классов!
При поиске пользователя отправляем запрос в базу и возвращаем юзернейм, если он есть и если верифицирован.
Берем юзернейм и записываем его в  id? и отображаем в верстке возле иконки. 

При клике добавляем собеседнику класс companion под розмещение смс слева. 


*/


"use strict";


// Взаимодействие с пользователями 
function userInteractive() {


    // Класс создания и отображения иконки найденного пользователя (компаньона)
    class searchedUser {
        constructor(neighbour, companion) {

            this.neighbour = neighbour; // Строка поиска
            this.companion = companion;
            this.renderCompanion();
        }


        // Активация чата При клике на пользователя
        activateChat() {
            const rightBar = document.querySelector('.right-bar'),
            rightBarEmpty = document.querySelector('.right-bar-empty'),
            delitionBin = document.querySelector('.searched-user__delete');

            // Добавляем обработчик ведру и удаление только что созданной иконки и диалог
            delitionBin.addEventListener("click", (e) => {

                // Очищаем диалоговое окно
                rightBar.style.display = 'none';
                rightBarEmpty.style.display = 'flex';

                e.target.parentElement.remove();
            });


            // Отображаем диалоговое окно 
            rightBarEmpty.style.display = 'none';
            rightBar.style.display = 'flex';

            // добавляем форме отправки смс id companion
            rightBar.querySelector('.send-message').id = this.companion;

            // включаем отправку смс
            this.sendMessage();
            


            // Добавляем прокрутку смскам
            function smsScroll() {

                const dialogueFrame = document.querySelector('.dialogue-frame'),
                dialogueFrameWrapper = dialogueFrame.querySelector('.dialogue-frame-wrapper');
            
                if (dialogueFrameWrapper.clientHeight >= dialogueFrame.clientHeight) {
            
                    dialogueFrameWrapper.classList.toggle('dialogue-frame-wrapper-scroll');
                    // Мотаем чат в самый низ (к новым смс)
                    dialogueFrame.scrollTop = dialogueFrame.scrollHeight - dialogueFrame.clientHeight;        
                }
            }
            smsScroll();
            
        } 


        // Рендерим свои смс 
        renderSms(companion, sms, time) {

            // Добавляем всему диалоговому окну id компаньона
            const dialogueFrame = document.querySelector('.dialogue-frame-wrapper');
            dialogueFrame.id = companion;


            // Задаем размеры рамки смс


            const mySms = document.createElement('div');
            mySms.classList.add('dialogue-frame__message-wrapper-right');
            mySms.innerHTML = `

                <div class="dialogue-frame__message">
                                        
                    <div class="dialogue-frame__message-text">${sms}</div>
                    <div class="dialogue-frame__message-time">${time}</div>
                </div>
            `;
            dialogueFrame.append(mySms);
        }


        // Отправляем смс
        sendMessage() {
            const form = document.querySelector('.send-message');

            form.addEventListener("submit", (e) => {
                e.preventDefault();

                const formData = new FormData(form),
                object = {};
                formData.forEach((value, key) => {
                    object[key] = value;
                });

                // Дописываем id компаньона в объект, после того как были записаны данные формы
                object.companion = form.id;

                fetch('php/send_sms.php', {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(object)
                })
                .then(res => res.json())
                .then(res => {

                    // Запускаем ф-цию рендеринга смс
                    this.renderSms(object.companion, object.sms, res);
                    form.reset();

                    console.log(res);
                    console.log(object.sms, object.companion);  
                });
            });
        }


        renderCompanion() {

            //Если где-то ранее уже был отображен пользователь - удлаляем иконку и заново отображаем
            if (document.getElementById(`${this.companion}`)) {
                document.getElementById(`${this.companion}`).remove();
            }

            const userIcon = document.createElement('div');
            userIcon.id = this.companion;
            userIcon.classList.add('searched-user');
            userIcon.innerHTML = `

                <i class="fas fa-user"></i>
                <div class="searched-user__username">${this.companion}</div>
                <i class="fas fa-trash searched-user__delete"></i>
            `;
            this.neighbour.after(userIcon);


            // Добавляем обработчик ведру и удаление только что созданной иконки 
            const delitionBin = document.querySelector('.searched-user__delete');
            delitionBin.addEventListener("click", (e) => {

                e.target.parentElement.remove();
            });


            // Добавляем обработчик иконке для отрытия диалогового окна
            const beginChat = document.querySelector('.searched-user__username');
            beginChat.addEventListener("click", (e) => {
                e.preventDefault();

                // Вызываем ранее созданную ф-цию активации чата
                this.activateChat(); 
            });
        }
    }


    // Отправляем запрос на сервер и проверяем пользователя
    function userSearch() {

        const form = document.querySelector('.user-search');

        form.addEventListener("submit", (e) => {
            e.preventDefault();
    
            const formData = new FormData(form),
            object = {};
            formData.forEach((value, key) => {
                object[key] = value;
            });
    
            fetch('php/user_search.php', {
                method: "POST", 
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(object)
            })
            .then(res => res.json())
            .then(res => {
                
                if (res === true) {
    
                    form.reset();
    
                    // Удаляем оповещение "Нет совпадений", если оно есть
                    if (document.querySelector('.no-matches')) {
                        document.querySelector('.no-matches').remove();
                    }
    
    
                    // Выводим найденого пользователя
                    const render = new searchedUser(
                        form,
                        object.companion
                    );
    
                } else {
    
                    // Удаляем оповещение "Нет совпадений", если оно есть
                    if (document.querySelector('.no-matches')) {
                        document.querySelector('.no-matches').remove();
                    }
    
                    // Оповещаем: Нет совпадений
                    const noMatches = document.createElement('div');
                    noMatches.classList.add('no-matches');
                    noMatches.innerHTML = `Нет совпадений ${object.companion}`;
                    form.after(noMatches);
                }
            });
    
        });
    }
    userSearch(); 
}
userInteractive();