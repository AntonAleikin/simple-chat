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
    }

    // Отвечаем о наличии пользователя в базе
    public function response ($output) {
        $this->output = $output;

        if ($this->output) {
            exit(json_encode(true)); // Возравщаем тру

        } else if ($this->output == 'Не удалось добавить в базу') {
            exit(json_encode('Не удалось добавить в базу'));

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
        include "connection_db.php";

        // Экранируем специальные символы в строках, полученных из формы для работы с SQL
        $this->email =  mysqli_real_escape_string($connection, $email);
        $this->username = mysqli_real_escape_string($connection, $username);
        $this->pass = mysqli_real_escape_string($connection, $pass);
        
        // Сразу шифруем пароль после получения от клиента
        $pass_hash = mysqli_real_escape_string($connection, password_hash($this->pass, PASSWORD_DEFAULT)); 


        // Проверяем, нет ли уже в базе такого email и только тогда добавляем 
        $count = mysqli_query($connection, "SELECT `id` FROM `users` WHERE `email` = '$this->email'");

        if (mysqli_num_rows($count) < 1) {

            // Создаем токен для пользователя и ложим в шестнадцатеричном виде в базу 
            global $token;
            $GLOBALS['token'] = mysqli_real_escape_string($connection, bin2hex(random_bytes(32)));

            $registrate = mysqli_query($connection, "INSERT INTO `users` (`email`, `token`, `username`, `pass`) 
            VALUES ('$this->email', '$token', '$this->username', '$pass_hash')");


            // Проверяем, добавился ли пользователь в базу и записываем ответ в глобальную переменную
            $count = mysqli_query($connection, "SELECT `id` FROM `users` WHERE `email` = '$this->email'");
            if (mysqli_num_rows($count) == 1) {
                $GLOBALS['registration_success'] = true;
            } else {
                $GLOBALS['registration_success'] = false;
            }

        } else {
            // Данный пользователь уже существует
            $GLOBALS['registration_success'] = 'Пользователь уже существует';
        }

        mysqli_close($connection);
    }


    // Записываем хеш email (token) в ссылку кнопки активации в письме
    public function editMail ($token, $blanc) {
        $location = "./includes/mail.php";

        // Открываем файл в виде массива так, что каждая строка файла - индекс массива.  
        $file = file($location);

        // Ссылка рассчитана на то, что в .htaccess убрано окончание php. Обычно: activation.php 
        $link = "https://simple-e-chat.ru.com/registration/activation?token=$token"; 

        if (!empty($token) && isset($token)) {

            $str = '<a style="text-decoration: none; color: white;"href='.$link.'>';

            // Меняем 121 строку на обновленную, со специальной ссылкой активации. 
            $file[123] = $str.PHP_EOL;
            file_put_contents($location, $file);

            // Очищаем глобальную переменную с токеном, после добавления его в письмо. 
            $GLOBALS['token'] = '';

        } else {
            // Убираем ссылку активации, ставим пустую строку в письмо
            $str = "<a style='text-decoration: none; color: white;' href='$blanc'>";
            $file[120] = $str.PHP_EOL;
            file_put_contents($location, $file);
        }
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

        $send = mail($to, $subject, $message, $headers);

        // Проверяем успех отправки и записываем ответ для отправки клиенту
        if ($send) {
            $GLOBALS['email_send'] = true;
        } else {
            $GLOBALS['email_send'] = false;
        }
    }


    // Активируем пользователя (ставим verified = 1), после его перехода по ссылке из email
    public function userActivation() {

        if (!empty($_GET['token']) && isset($_GET['token'])) {
            include "connection_db.php";
            $token =  mysqli_real_escape_string($connection, $_GET['token']);

            // Проверяем наличие токена в базе и был ли пользователь уже верифицирован
            $count = mysqli_query($connection, "SELECT `id` FROM `users` WHERE `token` = '$token' AND `verified` = '0'");
            if (mysqli_num_rows($count) == 1) {

                $activate = mysqli_query($connection, "UPDATE `users` SET `verified` = '1', `token` = '' WHERE
                `token` = '$token'");
                mysqli_close($connection);


                // Выводим сверстанную страницу с смс об успешной активации
                $location = "./php/includes/mail.php";
                $message = file_get_contents($location);
                echo $message;

            } else {
                // Если пользователь уже был верифицирован - не заходим в базу и оповещаем его
                mysqli_close($connection);
                echo 'Ваш аккаунт уже был активирован ранее';
            }
        }
    }
}