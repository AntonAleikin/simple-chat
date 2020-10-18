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


        // Добавляем прокрутку диалоговому окну, если много смс
        smsScroll(dialogueFrame, dialogueFrameWrapper) {
                
            if (dialogueFrameWrapper.clientHeight >= dialogueFrame.clientHeight) {
        
                dialogueFrameWrapper.classList.add('dialogue-frame-wrapper-scroll');
                // Мотаем чат в самый низ (к новым смс)
                dialogueFrame.scrollTop = dialogueFrame.scrollHeight - dialogueFrame.clientHeight;        
            }
        }


        // Активация чата При клике на пользователя
        activateChat(eventTarget, delitionBin) {

            // Вызываем анимацию иконок пользователей при открытии чата для десктопной версии
            if (window.matchMedia('(min-width: 768px)').matches) {

                this.userIconAnimation(eventTarget);
            }



            const rightBar = document.querySelector('.right-bar'),
            rightBarEmpty = document.querySelector('.right-bar-empty');


            // Убираем блок с надписью Пока нет сообщений... И Включаем блок для загрузки диалогового окна
            rightBarEmpty.style.display = 'none';
            rightBar.style.display = 'flex';

            // Очищаем предыдущее диалоговое окно и затем отображаем новое
            rightBar.innerHTML = '';

            // Создаем новое диалоговое окно 
            const dialogueFrame = document.createElement('div');
            dialogueFrame.id = this.dialogueId;
            dialogueFrame.dataset.companion = this.companion;
            dialogueFrame.classList.add('dialogue-frame');
            dialogueFrame.innerHTML = `

                <div data-companion="${this.companion}" class="dialogue-frame-wrapper"></div>
            `;
            rightBar.append(dialogueFrame);


            // Создаем форму отправки смс
            const sendSmsForm = document.createElement('form');
            sendSmsForm.dataset.companion = this.companion;
            sendSmsForm.classList.add('send-message');
            sendSmsForm.innerHTML = `
            
                <textarea required placeholder="Введите ваше сообщение" name="sms" type="text" 
                class="send-message__input"></textarea>

                <button class="send-message__button"><i class="fas fa-paper-plane"></i></button>
            `;
            rightBar.append(sendSmsForm);

            
            // Загружаем последнии 20 смс из истории переписки
            this.loadSms(dialogueFrame);
        

            // Добавляем прокрутку смскам. Сначала проверяем изменения в DOM с помощью MutationObserver
            const DOMmutations = new MutationObserver((mutation) => {

                this.smsScroll(dialogueFrame, dialogueFrame.firstElementChild);

            }).observe(dialogueFrame.firstElementChild, {childList: true});



            // включаем отправку смс
            this.sendMessage(sendSmsForm, dialogueFrame);
            
            

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
        loadSms(dialogueFrame) {

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

                loadedSms.forEach((sms) => {

                    this.renderSms(dialogueFrame.firstElementChild, 
                    sms.username, sms.text, sms.time);
                });
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
                    this.renderSms(dialogueFrame.firstElementChild, smsData.username ,smsData.text, smsData.time);
                    sendSmsForm.reset();


                    // Добавляем прокрутку смскам. Сначала проверяем изменения в DOM с помощью MutationObserver
                    const DOMmutations = new MutationObserver(() => {

                        this.smsScroll(dialogueFrame, dialogueFrame.firstElementChild);

                    }).observe(dialogueFrame.firstElementChild, {childList: true});

                    console.log(smsData); 
                });
            });
        }


        // Рендерим смс внутри dialogue-frame-wrapper 
        renderSms(dialogueFrameWrapper, username ,sms, time) {
            
            // Проверяем, кто отправитель и тому ренерим
            if (username == this.companion) {

                const companionSms = document.createElement('div');
                companionSms.classList.add('dialogue-frame__message-wrapper-left');
                companionSms.innerHTML = `

                    <div class="dialogue-frame__message" data-dialogueId = "${this.dialogueId}">

                        <div class="dialogue-frame__message-text">${sms}</div>
                        <div class="dialogue-frame__message-time">${time}</div>
                    </div>
                `;     
                dialogueFrameWrapper.append(companionSms);
                           
            } else {

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