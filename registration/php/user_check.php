<?php
include "includes/new_user.php";
// Инициализируем объект на основании класса юзер и вызываем нужные методы 
$newuser = new newUser();
$newuser->getRequest();
$newuser->userCheck($_POST);
$newuser->response($_GET);
