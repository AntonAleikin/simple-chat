<?php
include "./includes/chat_action.php";
// Инициализируем объект на основании класса действий в чате и вызываем нужные методы 
$sendsms = new chatAction();
$sendsms->getRequest();