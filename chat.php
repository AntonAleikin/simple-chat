<?php
    session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="css/bootstrap-grid.min.css">
    <link rel="stylesheet" href="css/main.min.css">
    <script defer src="js/nav.js"></script>
</head>

<body>
    <!-- Header -->
    <div class="container">
        
        <header class="header">
            <?php include './php/includes/nav.php'?>
        </header>

        <!-- Проверяем, есть ли в сессии авторизация и верификация и только тогда показываем контент  -->
        <?php
            if ($_SESSION['login'] === true && $_SESSION['verified'] === true && 
            !empty($_SESSION['email']) && isset($_SESSION['email'])) {
                
                echo 'Шалости удались! <br>'.$_SESSION['email'];

                unset($_SESSION['login']);
                unset($_SESSION['verified']);
                unset($_SESSION['email']);
            }
        ?>

    </div>
</body>
</html>