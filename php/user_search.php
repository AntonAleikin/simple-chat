<?php
include "./includes/chat_action.php";
// Инициализируем объект на основании класса вызываем нужные методы 
$usersearch = new chatAction();
$usersearch->getRequest();
$usersearch->userSearch($_POST['username']);
$usersearch->response($GLOBALS['user_search_success']);