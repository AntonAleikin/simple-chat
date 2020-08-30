<?php
include "includes/connection_db.php"; // Подключаемся к базе данных 
$name = $_POST["name"];
$pass = $_POST["pass"];
// Проверить, нет ли в базе уже такого пользователя и асинхронно вернуть ответ 

$registrate = mysqli_query($connection, "INSERT INTO `users` (`name`, `pass`) VALUES ('$name', '$pass')");
//echo var_dump($_POST); // ответ сервера