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


    // Проверяем, нет ли в базе уже такого email
    public function emailCheck($email) {
        $this->email = $email;

        include "connection_db.php";
        $_GET = mysqli_fetch_assoc(mysqli_query($connection, "SELECT * FROM users WHERE email ='$this->email'"));
        mysqli_close($connection);
    }


    // Проверяем, нет ли в базе уже такого пользователя
    public function userCheck($username) {
        $this->username = $username;

        include "connection_db.php";
        $_GET = mysqli_fetch_assoc(mysqli_query($connection, "SELECT * FROM users WHERE username ='$this->username'"));
        mysqli_close($connection);
    }


    // Cоздаем нового пользователя в базе и проверяем, был ли он успешно добавлен
    public function userCreation($email, $username, $pass) {
        $this->email = $email;
        $this->username = $username;
        $this->pass = $pass;

        // Сразу шифруем пароль после получения от клиента
        $pass_hash = password_hash($this->pass, PASSWORD_DEFAULT); 
        
        include "connection_db.php";
        $registrate = mysqli_query($connection, "INSERT INTO `users` (`email`, `username`, `pass`) 
        VALUES ('$this->email','$this->username', '$pass_hash')");

        // Отправляем почту
        //mail("aleikinaa98@gmail.com", "Тестовое письмо", "Новый пользователь зарегался!");

        // Проверяем, добавилась ли запись в базу
        $_GET = mysqli_fetch_assoc(mysqli_query($connection, "SELECT * FROM users WHERE email ='$this->email'"));
        
        mysqli_close($connection);
    }

    // Отправляем письмо на почту пользователя о успешной регистрации и просьбе подтвердить пароль
    public function sendMail ($email) {
        $this->email = $email;

        $location = "./includes/mail.php";

        $to = "$this->email";
        $subject = "Для завершения регистрации подтвердите ваш email";
        
        $headers = "From: simple E-chat <info@simple-e-chat.ru.com>\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=utf-8\r\n";
        
        $message = file_get_contents($location);

        mail($to, $subject, $message, $headers);
    }
}
