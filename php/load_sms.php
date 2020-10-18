<?php
include "./includes/chat_action.php";
// Инициализируем объект на основании класса действий в чате и вызываем нужные методы 
$loadSms = new chatAction();
$loadSms->getRequest();
$loadSms->loadSms($_POST);
$loadSms->response($GLOBALS['loaded_sms']);