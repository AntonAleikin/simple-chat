<?php
include("includes/new_user.php");
// Инициализируем объект на основании класса юзер и вызываем нужные методы 
$newuser = new newUser();
$newuser->getRequest();
$newuser->userCreation($_POST['email'], $_POST['username'], $_POST['pass']);
$newuser->sendMail($_POST['email']);
$newuser->response($_GET);