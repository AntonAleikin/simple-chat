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
        constructor(neighbour, companion, dialogueId) {

            this.neighbour = neighbour; // Строка поиска
            this.companion = companion;
            this.dialogueId = dialogueId;
        }



        // Анимация иконок при открытии чата
        userIconAnimation (eventTarget) {

            const userIcons = document.querySelectorAll('.searched-user');
            userIcons.forEach((icon) => {

                icon.classList.remove('searched-user-active');
            });

            eventTarget.classList.add('searched-user-active');
        }


        // Активация чата При клике на пользователя
        activateChat(eventTarget, delitionBin) {

            // Вызываем анимацию иконок пользователей при открытии чата для десктопной версии
            if (window.matchMedia('(min-width: 768px)').matches) {

                this.userIconAnimation(eventTarget);
            }


            // Загружаем последнии 20 смс из истории переписки
            this.loadSms();
            

            const rightBar = document.querySelector('.right-bar'),
            rightBarEmpty = document.querySelector('.right-bar-empty');


            // Убираем блок с надписью Пока нет сообщений... И Включаем блок для загрузки диалогового окна
            rightBarEmpty.style.display = 'none';
            rightBar.style.display = 'flex';

            // Очищаем предыдущее диалоговое окно и затем отображаем новое
            rightBar.innerHTML = '';

            // Создаем новое диалоговое окно 
            const dialogueFrame = document.createElement('div');
            dialogueFrame.id = this.companion;
            dialogueFrame.dataset.companion = this.companion;
            dialogueFrame.classList.add('dialogue-frame');
            dialogueFrame.innerHTML = `

                <div id="${this.companion}" data-companion="${this.companion}" class="dialogue-frame-wrapper"></div>
            `;
            rightBar.append(dialogueFrame);


            // Создаем форму отправки смс
            const sendSmsForm = document.createElement('form');
            sendSmsForm.id = this.companion;
            sendSmsForm.dataset.companion = this.companion;
            sendSmsForm.classList.add('send-message');
            sendSmsForm.innerHTML = `
            
                <textarea required placeholder="Введите ваше сообщение" name="sms" type="text" 
                class="send-message__input"></textarea>

                <button class="send-message__button"><i class="fas fa-paper-plane"></i></button>
            `;
            rightBar.append(sendSmsForm);


            // включаем отправку смс
            this.sendMessage(sendSmsForm, dialogueFrame);
            

            // Добавляем прокрутку смскам
            function smsScroll(dialogueFrame, dialogueFrameWrapper) {
            
                if (dialogueFrameWrapper.clientHeight >= dialogueFrame.clientHeight) {
            
                    dialogueFrameWrapper.classList.toggle('dialogue-frame-wrapper-scroll');
                    // Мотаем чат в самый низ (к новым смс)
                    dialogueFrame.scrollTop = dialogueFrame.scrollHeight - dialogueFrame.clientHeight;        
                }
            }
            smsScroll(dialogueFrame ,dialogueFrame.firstElementChild);



            // Удаляем диалоговое окно вместе с иконкой пользователя
            delitionBin.addEventListener("click", (e) => {


                // Удаляем диалоговое окно и форму этого пользователя
                dialogueFrame.remove();
                sendSmsForm.remove();


                // Показываем блок с надписью Нет сообщений...
                rightBarEmpty.style.display = 'flex';
                rightBar.style.display = 'none';


                delitionBin.parentElement.remove();
            });
        } 



        // Загружаем историю переписки
        loadSms() {

            /* const companionData = {
                'companion': this.companion,
                'dialogueId': this.dialogueId
            }; */

            fetch('php/load_sms.php', {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(this.dialogueId)
            })
            .then(loadedSms => loadedSms.json())
            .then(loadedSms => {

                console.log(loadedSms);
            });
        }



        // Отправляем смс
        sendMessage(sendSmsForm, dialogueFrame) {

            sendSmsForm.addEventListener("submit", (e) => {
                e.preventDefault();

                const formData = new FormData(sendSmsForm),
                object = {};
                formData.forEach((value, key) => {
                    object[key] = value;
                });

                // Дописываем компаньона в объект, после того как были записаны данные формы
                object.companion = sendSmsForm.dataset.companion;

                fetch('php/send_sms.php', {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(object)
                })
                .then(smsData => smsData.json())
                .then(smsData => {

                    // Записываем id только что созданного диалога, если это первая смс
                    if (this.dialogueId == '' || this.dialogueId == undefined) {

                        this.dialogueId = smsData.dialogueId;
                    }

                    // Запускаем ф-цию рендеринга смс
                    this.renderSms(dialogueFrame.firstElementChild ,smsData.text, smsData.time);
                    sendSmsForm.reset();

                    console.log(smsData); 
                });
            });
        }


        // Рендерим свои смс внутри dialogue-frame-wrapper 
        renderSms(dialogueFrameWrapper ,sms, time) {

            //if ()


            const mySms = document.createElement('div');
            mySms.classList.add('dialogue-frame__message-wrapper-right');
            mySms.innerHTML = `

                <div class="dialogue-frame__message" data-dialogueId = "${this.dialogueId}">
                                        
                    <div class="dialogue-frame__message-text">${sms}</div>
                    <div class="dialogue-frame__message-time">${time}</div>
                </div>
            `;
            dialogueFrameWrapper.append(mySms);
        }


        // Отображаем иконку пользователя
        renderCompanion() {
            
            //Если где-то ранее уже был отображен пользователь - удлаляем иконку и заново отображаем
            document.querySelectorAll('.searched-user').forEach((companion) => {
                if(companion != null && companion.dataset.companion == this.companion) {

                    companion.remove();
                }
            }); 

            const userIcon = document.createElement('div');
            userIcon.id = this.companion;
            userIcon.dataset.companion = this.companion;
            userIcon.classList.add('searched-user');
            userIcon.innerHTML = `

                <i class="fas fa-user"></i>
                <div class="searched-user__username">${this.companion}</div>
                <i class="fas fa-trash searched-user__delete"></i>
            `;
            this.neighbour.after(userIcon);
            


            // Добавляем обработчик ведру и удаление только что созданной иконки 
            userIcon.querySelector('.searched-user__delete').addEventListener("click", (e) => {

                e.target.parentElement.remove();
            });

            
            
            // Добавляем обработчик иконке для отрытия диалогового окна
            userIcon.querySelector('.searched-user__username').addEventListener("click", (e) => {

                this.activateChat(e.target.parentElement, userIcon.querySelector('.searched-user__delete'));
            });
        }
    }


    // Проверяем активные диалоги и сразу после загрузки страницы оторажаем иконки этих пользователей
    function checkActiveChats() {

        fetch('php/check_active_chats.php')
        .then(activeDialogues => activeDialogues.json())
        .then(activeDialogues => {
            
            activeDialogues.forEach((activeDialogue) => {
                
                // Выводим иконку пользователя, с которым есть активный чат
                const render = new searchedUser(
                    document.querySelector('.user-search'), // форма поиска
                    activeDialogue.companion,
                    activeDialogue.dialogueId
                ).renderCompanion();
            });
        }); 
    }
    checkActiveChats();
    


    // Ищем пользователя
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
            .then(searchedCompanion => searchedCompanion.json())
            .then(searchedCompanion => {
                
                if (searchedCompanion != false && searchedCompanion != '') {

                    form.reset();
    
                    // Удаляем оповещение "Нет совпадений", если оно есть
                    if (document.querySelector('.no-matches')) {
                        document.querySelector('.no-matches').remove();
                    }
    
    
                    // Выводим найденого пользователя
                    const render = new searchedUser(
                        form,
                        searchedCompanion.companion,
                        searchedCompanion.dialogueId
                    ).renderCompanion();
    
                } else {
    
                    // Удаляем оповещение "Нет совпадений", если оно есть
                    if (document.querySelector('.no-matches')) {
                        document.querySelector('.no-matches').remove();
                    }
    
                    // Оповещаем: Нет совпадений
                    const noMatches = document.createElement('div');
                    noMatches.classList.add('no-matches');
                    noMatches.innerHTML = `Нет совпадений ${searchedCompanion.companion}`;
                    form.after(noMatches);
                }
            });
    
        });
    }
    userSearch();
}
userInteractive();