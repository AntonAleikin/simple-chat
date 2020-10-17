<?php
include "./includes/chat_action.php";
// Инициализируем объект на основании класса действий в чате и вызываем нужные методы 
$checkActiveChats = new chatAction();
$checkActiveChats->checkActiveChats();
$checkActiveChats->response($GLOBALS['active_chats_companions']);