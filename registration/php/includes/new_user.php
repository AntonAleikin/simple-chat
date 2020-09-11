<?php
class newUser {
    // Объявляем переменные (свойства)

    private $email;
    private $username;
    private $pass;
    private $output;

    // Получаем, разшифровываем и записываем Json для дальнейшей работы 
    public function getRequest () {
        $_POST = json_decode(file_get_contents("php://input"), true);
        //exit(json_encode($_POST)); // Для ответа сервера
    }

    // Отвечаем о наличии пользователя в базе
    public function response ($output) {
        $this->output = $output;

        if ($this->output) {
            exit(json_encode(true)); // Возравщаем тру
        } else {
            exit(json_encode(false));
        } 
    }


    // Проверяем, нет ли в базе уже такого пользователя
    public function userCheck($username) {
        $this->username = $username;

        include "connection_db.php";
        $_GET = mysqli_fetch_assoc(mysqli_query($connection, "SELECT * FROM users WHERE username ='$this->username'"));
        mysqli_close($connection);
    }


    // Cоздаем нового пользователя в базе и проверяем, был ли он успешно добавлен
    public function userCreation($username, $pass) {
        $this->username = $username;
        $this->pass = $pass;

        // Сразу шифруем пароль после получения от клиента
        $pass_hash = password_hash($this->pass, PASSWORD_DEFAULT); 
        
        include "includes/connection_db.php";
        $registrate = mysqli_query($connection, "INSERT INTO `users` (`username`, `pass`) VALUES ('$this->username', 
        '$pass_hash')");

        // Проверяем, добавилась ли запись в базу
        $_GET = mysqli_fetch_assoc(mysqli_query($connection, "SELECT * FROM users WHERE username ='$this->username'"));
        
        mysqli_close($connection);
    }
}
