<?php
// Создаем класс для работы с чатом
class chatAction {

    private $username;
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


    // Поиск пользователя в чате
    public function userSearch ($username) {

        $this->username = $username;

        // Проверяем есть ли пользователь в базе и верифицирован ли он
        include "connection_db.php";
        $count = mysqli_query($connection, "SELECT `id` FROM users WHERE `username` = '$this->username' AND 
        `verified` = '1'");
        mysqli_close($connection);

        if (mysqli_num_rows($count) == 1) {
            
            $GLOBALS['user_search_success'] = true;

        } else {
            $GLOBALS['user_search_success'] = false;
        }
    }
}