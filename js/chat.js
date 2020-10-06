/* 
Все делаем с помощью классов!
При поиске пользователя отправляем запрос в базу и возвращаем юзернейм, если он есть и если верифицирован.
Берем юзернейм и записываем его в  id? и отображаем в верстке возле иконки. 

При клике добавляем собеседнику класс companion под розмещение смс слева. 


*/


"use strict";

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