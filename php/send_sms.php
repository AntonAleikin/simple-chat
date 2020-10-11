<?php
include "./includes/chat_action.php";
// Инициализируем объект на основании класса действий в чате и вызываем нужные методы 
$sendsms = new chatAction();
$sendsms->getRequest();
$sendsms->sendSms($_POST['companion'], $_POST['sms']);
$sendsms->response($GLOBALS['sendSms_success']);