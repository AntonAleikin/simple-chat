<?php
    session_start();

    if ($_SESSION['login'] === true && !empty($_SESSION['email']) && isset($_SESSION['email'])) {

        // Если во время сессии перейти по ссылке на эту ст - попадем на главную
        header("Location: /");
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="css/bootstrap-grid.min.css">
    <link rel="stylesheet" href="css/main.min.css">
    <script defer src="js/nav.js"></script>
    <script defer src="js/login.js"></script>
</head>

<body>
    <!-- Header -->
    <div class="container">
        <header class="header">
            <?php include './php/includes/nav.php'?>
        </header>

        <form action="#" class="login-form">
            <input required placeholder="example@mail.com" name="email" type="email" class="login-form__input login-form__input-email">
            <input required placeholder="Пароль" name="pass" type="password" maxlength="25" class="login-form__input login-form__input-pass">
            <button class="login-form__button">Войти</button>
        </form>
    </div>
 
</body>
</html>