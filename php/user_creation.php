<?php
include "./includes/new_user.php";
// Инициализируем объект на основании класса юзер и вызываем нужные методы 
$newuser = new newUser();
$newuser->getRequest();
$newuser->userCreation($_POST['email'], $_POST['username'], $_POST['pass']);

// Если пользователь успешно добавлен вбазу - отправляем email и ответ клиенту
if ($GLOBALS['registration_success'] === true) {

    // Добавляем токен в письмо
    $newuser->editMail($GLOBALS['token'], '');

    $newuser->sendMail($_POST['email']);

    // Очищаем письмо шаблон письма от токена
    $newuser->editMail($token, '');

    $newuser->response($GLOBALS['email_send']);
} else {
    $newuser->response($GLOBALS['registration_success']);
}