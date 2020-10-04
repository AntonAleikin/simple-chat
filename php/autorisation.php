<?php
include "includes/user_login.php";
// Инициализируем объект на основании класса авторизации и вызываем нужные методы 
$userlogin = new autorisation();
$userlogin->getRequest();
$userlogin->login($_POST['email'],$_POST['pass']);
$userlogin->beginSession($GLOBALS['login_success'], $_POST['email']);
$userlogin->response($GLOBALS['login_success']);