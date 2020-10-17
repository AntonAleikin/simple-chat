<?php
// Создаем класс для работы с чатом
class chatAction {

    private $username;
    private $companion;
    private $dialogueId;
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
        $checkCompanion = mysqli_query($connection, "SELECT `username` FROM users WHERE `username` = '$this->companion' AND 
        `verified` = '1'");
        mysqli_close($connection);

        if (mysqli_num_rows($checkCompanion) == 1) {

            // Отправляем клиенту юзернейм найденого компаньона
            $getCompanion = [
                'companion' => mysqli_fetch_assoc($checkCompanion)['username']
            ];
            
            $GLOBALS['companion_search_success'] = $getCompanion;

        } else {
            $GLOBALS['companion_search_success'] = false;
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

        } else {

            // Если нет - создаем новый диалог, а потом ложим смс
            $createDialogue = mysqli_query($connection, "INSERT INTO `dialogues` (`username1`, `username2`)
            VALUES ('$this->username', '$this->companion')");

            if ($createDialogue === true) {

                $checkDialogue = mysqli_query($connection, "SELECT `id` FROM `dialogues` WHERE 
                `username1` = '$this->username' AND `username2` = '$this->companion'");

                $dialogueId = mysqli_fetch_row($checkDialogue)[0];

                $putSms = mysqli_query($connection, "INSERT INTO `sms` (`username`, `companion`, `text`, `dialogue_id`) 
                VALUES ('$this->username', '$this->companion', '$this->sms', '$dialogueId')");
            }
        }
        
        
        if ($putSms === true) {

            // Получаем id диалога, время и текст только что положеной в базу смс
            $getSmsData = mysqli_fetch_assoc(
            mysqli_query($connection, "SELECT `dialogue_id`, `time`, `text` FROM `sms` WHERE `text` = '$this->sms'
            ORDER BY time DESC LIMIT 1")
            );

            mysqli_close($connection);

            // Записываем все данные смс в объект (ассоц массив) и отправляем клиенту
            $smsData = [
                'dialogueId' => $getSmsData['dialogue_id'],
                'time' => date('H:i', time() - (time() - strtotime($getSmsData['time']))), // Преобразовываем дату из базы в часы и минуты
                'text' => $getSmsData['text']
            ]; 

            $GLOBALS['sendSms_success'] = $smsData;
        } else {
            $GLOBALS['sendSms_success'] = false;
        }
    }



    // Проверяем все активные чаты пользователя при загрузке чата
    public function checkActiveChats () {

        session_start();
        $this->username = $_SESSION['username'];

        include "connection_db.php";

        // Создаем массив, куда поместим всех компаньонов и их id диалогов, с которыми у нас начат диалог
        $companions = []; 
        $companionsRow = [];

        // Получаем все диалоги с моим участием. 
        $activeDialogues = mysqli_query($connection, "SELECT * FROM `dialogues` WHERE 
        `username1` = '$this->username' OR `username2` = '$this->username'");
        mysqli_close($connection);

        // Отоброжаем строку таблицы как ассоц массив с каждым таким диалогом, пока они не закончатся 
        while ($arr = mysqli_fetch_assoc($activeDialogues)) {
            
            //Перебираем єлемы полученной строки и записываем id и companion в объект (ассоц массив) $companionsRow
            foreach ($arr as $colName => $value) {
                
                if ($colName == 'id') { 
                    
                    $colName = 'dialogueId';
                    $companionsRow[$colName] = $value;
                }

                if ($value != $this->username && $colName != 'id') {

                    $colName = 'companion';
                    $companionsRow[$colName] = $value;
                } 
                
            }
            // Добавляем объекты с dialogueId и companion в конец массива $companions после каждой найденной строки таблицы
            $companions[] = $companionsRow;
        }
        $GLOBALS['active_chats_companions'] = $companions;
    }


    
    // загружаем последние 20 смс и отправляем клиенту, при открытии чата
    public function loadSms ($dialogueId) {

        $this->dialogueId = $dialogueId;

    
        $loadedSms = []; 

        // Выбираем последние 20 смс из базы 
        include "connection_db.php";
        $getSms = mysqli_query($connection, "SELECT `username`, `text`, `time` FROM `sms` WHERE 
        `dialogue_id` = '$this->dialogueId' ORDER BY time DESC LIMIT 20");


        while ($rows = mysqli_fetch_assoc($getSms)) {

            // Добавляем в начало массива каждую строку из таблицы в виде объекта
            array_unshift($loadedSms, $rows);
        }
        //rint_r($loadedSms);
        exit(json_encode($loadedSms));


        // Нужно еще добавить Наш юзернейм для распознавания нас!!!
    }
}