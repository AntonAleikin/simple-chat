<?php
include "./includes/chat_action.php";
// Инициализируем объект на основании класса действий в чате и вызываем нужные методы 
$usersearch = new chatAction();
$usersearch->getRequest();
$usersearch->userSearch($_POST['companion']);
$usersearch->response($GLOBALS['companion_search_success']);