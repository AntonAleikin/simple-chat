<?php
    session_start();

    /* unset($_SESSION['login']);
    unset($_SESSION['email']);
    unset($_SESSION['username']);
    unset($_SESSION['verified']); */
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat</title>
    <?php include './php/includes/main_head.php'?>
    <script defer src="js/chat.js"></script>
</head>

<body>
    
    <div class="container">
        
        <!-- Header -->
        <header class="header">
            <?php include './php/includes/nav.php'?>
        </header>


        <!-- Проверяем, есть ли в сессии авторизация и верификация и только тогда показываем контент  -->
        <?php
            if ($_SESSION['login'] === true && $_SESSION['verified'] === true && 
            !empty($_SESSION['email']) && isset($_SESSION['email']) && 
            !empty($_SESSION['username']) && isset($_SESSION['username'])) { 
        ?>    
            
            <div class="chat">

                <!-- Левый блок -->
                <div class="left-bar">

                    <!-- Окно поиска пользователей -->
                    <form class="user-search">

                        <input placeholder="Найти пользователя" name="companion" type="search" class="user-search__input">

                        <button class="user-search__button"><i class="fas fa-search"></i></button>
                    </form>


                    <!-- Найденные пользователи -->
                    <!-- <div class="searched-user">

                        <i class="fas fa-user searched-user__icon"></i>
                        <div class="searched-user__username">klass</div>
                        <i class="fas fa-trash searched-user__delete"></i>
                    </div> -->
                </div>


                <!-- Окно смс -->
                <div class="right-bar-empty">
                    <div>Пока нет диалогов..</div>
                </div>

                <div class="right-bar">
                    
                    <!-- Диалоговое окно -->
                    <!-- <div class="dialogue-frame">

                        Обертка, которая держит смс внизу окна
                        <div class="dialogue-frame-wrapper">


                            Обертка для смс, чтобы занимали весь экран как блок
                            <div class="dialogue-frame__message-wrapper-right">

                                <div class="dialogue-frame__message">
                                    
                                    <div class="dialogue-frame__message-text">Привет!</div>
                                    <div class="dialogue-frame__message-time">11:51</div>
                                </div>
                            </div>

                            СМС опонента слева и другого цвета
                            <div class="dialogue-frame__message-wrapper-left">

                                <div class="dialogue-frame__message">

                                    <div class="dialogue-frame__message-text">Привет!</div>
                                    <div class="dialogue-frame__message-time">11:51</div>
                                </div>
                            </div>

                            
                        </div>
                    </div> -->


                    <!-- <form class="send-message">

                        <textarea required placeholder="Введите ваше сообщение" name="sms" type="text" class="send-message__input"></textarea>

                        <button class="send-message__button"><i class="fas fa-paper-plane"></i></button>
                    </form> -->
                </div>
            </div>

        <?php
            }
        ?>        
  
    </div>
</body>
</html>