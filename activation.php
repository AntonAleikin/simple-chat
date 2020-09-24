<?php
include("./php/includes/new_user.php");
// Инициализируем объект на основании класса юзер и вызываем нужные методы 
$newuser = new newUser();
$newuser->userActivation();