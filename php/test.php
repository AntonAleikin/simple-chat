<?php
include "./includes/new_user.php";
// Инициализируем объект на основании класса юзер и вызываем нужные методы 
$newuser = new newUser();
$newuser->getRequest();
$newuser->userCreation("aleikinaa98@gmail.com", "klass", "Aleikin18bsfg");

// Если пользователь успешно добавлен вбазу - отправляем email и ответ клиенту
if ($GLOBALS['registration_success'] === true) {

    echo $GLOBALS['registration_success'];

    // Добавляем токен в письмо
    $newuser->editMail($GLOBALS['token'], '');

    $newuser->sendMail("aleikinaa98@gmail.com");

    // Очищаем письмо шаблон письма от токена
    $newuser->editMail($token, '');

    echo $GLOBALS['email_send'];
    //$newuser->response($GLOBALS['email_send']);
} else {
    //$newuser->response($GLOBALS['registration_success']);
    echo $GLOBALS['registration_success'];
}