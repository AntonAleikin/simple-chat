<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Registration</title>
    <link rel="stylesheet" href="css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="css/bootstrap-grid.min.css">
    <link rel="stylesheet" href="css/main.min.css">
    <script defer src="js/nav.js"></script>
    <script defer src="js/registration.js"></script>
</head>

<body>
    
    <div class="container">

        <header>
            <?php include './php/includes/nav.php'?>
        </header>

        <div class="registration">
            <form action="#" class="registration__form">
                <input required placeholder="example@mail.com" name="email" type="email" class="registration__email">
                <input required placeholder="Имя пользователя" name="username" type="text" maxlength="20" class="registration__username">
                <input required placeholder="Пароль" name="pass" type="password" maxlength="25" class="registration__pass">
                <button class="registration__btn">Зарегистрироваться</button>
            </form>
        </div>
    </div>
</body>
</html>