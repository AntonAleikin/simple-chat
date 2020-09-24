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
</head>

<body>
    <!-- Header -->
    <div class="container">
        <Header>
            <?php include './php/includes/nav.php'?>
        </Header>

        <div class="login">
            <form action="#" class="login__form">
                <input required placeholder="example@mail.com" name="email" type="email" class="login__email">
                <input required placeholder="Пароль" name="pass" type="password" maxlength="25" class="login__pass">
                <button class="login__btn">Войти</button>
            </form>
        </div>
    </div>
 
</body>
</html>