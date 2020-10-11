<?php
// Создаем класс для работы с чатом
class chatAction {

    private $username;
    private $companion;
    private $sms;
    private $output;


    // Получаем, разшифровываем и записываем Json для дальнейшей работы 
    public function getRequest () {
        $_POST = json_decode(file_get_contents("php://input"), true);
    }


    // Отправляем ответ клиенту
    public function response ($output) {
        $this->output = $output;

        if ($this->output === true) {
            exit(json_encode(true)); 

        } else if ($this->output === false){
            exit(json_encode(false));

        } else {
            exit(json_encode($this->output));
        }
    }



    // Поиск пользователя в чате
    public function userSearch ($companion) {

        $this->companion = $companion;

        // Проверяем есть ли пользователь в базе и верифицирован ли он
        include "connection_db.php";
        $count = mysqli_query($connection, "SELECT `id` FROM users WHERE `username` = '$this->companion' AND 
        `verified` = '1'");
        mysqli_close($connection);

        if (mysqli_num_rows($count) == 1) {
            
            $GLOBALS['user_search_success'] = true;

        } else {
            $GLOBALS['user_search_success'] = false;
        }
    }



    // Принимаем смс и ложим в базу вместе с юзернеймами
    public function sendSms ($companion, $sms) {

        session_start();

        include "connection_db.php";

        $this->username = mysqli_real_escape_string($connection, $_SESSION['username']); // Свой юзернейм получаем из сессии
        $this->companion = mysqli_real_escape_string($connection, $companion);
        $this->sms = mysqli_real_escape_string($connection, $sms);


        // Проверяем, нет ли уже диалога между этими пользователями (получаем id диалога)
        $checkDialogue = mysqli_query($connection, "SELECT `id` FROM `dialogues` WHERE 
        `username1` = '$this->username' AND `username2` = '$this->companion' OR
        `username1` = '$this->companion' AND `username2` = '$this->username'");

        if (mysqli_num_rows($checkDialogue) == 1) {

            // Если есть, то получаем id диалога и просто ложим в базу смс
            $dialogueId = mysqli_fetch_row($checkDialogue)[0];

            $putSms = mysqli_query($connection, "INSERT INTO `sms` (`username`, `companion`, `text`, `dialogue_id`) 
            VALUES ('$this->username', '$this->companion', '$this->sms', '$dialogueId')");

        }else {

            // Если нет - создаем новый диалог, а потом ложим смс
            $createDialogue = mysqli_query($connection, "INSERT INTO `dialogues` (`username1`, `username2`)
            VALUES ('$this->username', '$this->companion')");

            if ($createDialogue === true) {

                $checkDialogue = mysqli_query($connection, "SELECT `id` FROM `dialogues` WHERE 
                `username1` = '$this->username'");

                $dialogueId = mysqli_fetch_row($checkDialogue)[0];

                $putSms = mysqli_query($connection, "INSERT INTO `sms` (`username`, `companion`, `text`, `dialogue_id`) 
                VALUES ('$this->username', '$this->companion', '$this->sms', '$dialogueId')");


                // Записываем id нового диалога в сессию
                //$_SESSION['dialogue_id'."$dialogueId"] = $dialogueId;
            }
        }
        
        
        if ($putSms === true) {

            // Получаем время только что положеной в базу смс
            $getTime = mysqli_fetch_row(
            mysqli_query($connection, "SELECT `time` FROM `sms` WHERE `text` = '$this->sms'
            ORDER BY time DESC LIMIT 1")
            );

            mysqli_close($connection);

            // Преобразовываем дату, полученную из базы в часы и минуты
            $time = date('H:i', time() - (time() - strtotime($getTime[0])));

            $GLOBALS['sendSms_success'] = $time;
        } else {
            $GLOBALS['sendSms_success'] = false;
        }
    }



    // Проверяем все активные чаты пользователя при загрузке чата
    public function checkActiveChats () {

        session_start();
        $this->username = $_SESSION['username'];

        include "connection_db.php";

    }


    
    // загружаем всю историю смс и отправляем клиенту, при открытии чата
    public function loadSms () {

    }
}