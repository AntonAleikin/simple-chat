<?php
// Получаем хешированный пароль
$get_hash = mysqli_fetch_assoc(mysqli_query($connection, "SELECT `pass` FROM `users` WHERE `username` = '$this->username'"));

// Проверяем сходства двух паролей 
$verified_pass = password_verify($this->pass, $get_hash['pass']); 

// Отправляем ответ
$_GET = mysqli_fetch_assoc(mysqli_query($connection, "SELECT * FROM users WHERE username ='$this->username'")) && $verified_pass;