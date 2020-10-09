<?php
// Создаем класс авторизации пользователя
class autorisation {

    private $email;
    private $pass;
    private $output;

    // Получаем, разшифровываем и записываем Json для дальнейшей работы 
    public function getRequest () {
        $_POST = json_decode(file_get_contents("php://input"), true);
    }


    // Отправляем ответ клиенту
    public function response ($output) {
        $this->output = $output;

        if ($this->output === true) {
            exit(json_encode(true)); // Возравщаем тру
        } else {
            exit(json_encode(false));
        } 
    }


    // Авторизируем пользователя
    public function login ($email, $pass) {

        $this->email = $email;
        $this->pass = $pass;

        include "connection_db.php";
        $count = mysqli_query($connection, "SELECT `id` FROM users WHERE email ='$this->email'");

        // Если email есть в базе - проверяем пароль
        if (mysqli_num_rows($count) == 1) {

            // Получаем хешированный пароль
            $pass_hash = mysqli_fetch_assoc(mysqli_query($connection, "SELECT `pass` FROM `users` WHERE 
            `email` = '$this->email'"));
            
            mysqli_close($connection);

            // Проверяем сходства двух паролей 
            $verified_pass = password_verify($this->pass, $pass_hash['pass']); 

            // Если пароль верный (сходство есть)
            if ($verified_pass === true) {
                $GLOBALS['login_success'] = true;
            } else {
                // Отправляем ответ: вы ввели неверный логин или пароль.. Пользователя нет в базе
                $GLOBALS['login_success'] = false;
            }

        }  else {
            // Отправляем ответ: вы ввели неверный логин или пароль.. Пользователя нет в базе
            $GLOBALS['login_success'] = false;  
        } 

    }

    // Начинаем сессию
    public function beginSession ($loginCheck, $email) {
        $this->email = $email;

        // Если логин успешен - начинаем сессию 
        if ($loginCheck === true) {

            include "connection_db.php";
            $count = mysqli_query($connection, "SELECT `id` FROM users WHERE `email` = '$this->email' 
            AND `verified` = '1'");

            // Получаем юзернейм
            $username = mysqli_fetch_row(
            mysqli_query($connection, "SELECT `username` FROM users WHERE `email` = '$this->email'"));
            mysqli_close($connection);

            // Начало сессии
            session_start();

            // Записываем верификацию, если она уже удалилась после того как ее записали в new_user
            if (mysqli_num_rows($count) == 1 && empty($_SESSION['verified']) && !isset($_SESSION['verified'])) {

                $_SESSION['verified'] = true;
            } 

            //Записываем в сессию email, юзернейм и что логин успешен  
            $_SESSION['login'] = true;
            $_SESSION['email'] = $this->email;
            $_SESSION['username'] = $username[0];
            
            // Удаляем переменные сессии с помощью ф-ции unset: unset($_SESSION['login']);
        } 
    }
}