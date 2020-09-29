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

        <header class="header">
            <?php include './php/includes/nav.php'?>
        </header>

        <form action="#" class="registration-form">
            <input required placeholder="example@mail.com" name="email" type="email" class="registration-form__input registration-form__input-email">
            <input required placeholder="Имя пользователя" name="username" type="text" maxlength="20" class="registration-form__input registration-form__input-username">
            <input required placeholder="Пароль" name="pass" type="password" maxlength="30" class="registration-form__input registration-form__input-pass">
            <input required placeholder="Повторите пароль" name="" type="password" maxlength="30" class="registration-form__input registration-form__input-pass-confirmation">
            <button class="registration-form__button">Зарегистрироваться</button>
        </form>
    </div>


    <!-- Модальное окно с оповещением -->
    <div class="overlay">

        <div class="modal">

            <div class="modal__title">Поздравляем, Вы успешно зарегистрировались!</div>

            <div class="modal__text">
                Для активации вашего аккаунта, вам необходимо подтвердить адрес электронной почты.
                Это можно сделать, нажав кнопку "Подтвердить email" в письме, 
                которое мы только что отправили вам на почту. <br><br>
                П.С. Если вы не обнаружили письмо в вашем электронном ящике, пожалуйста, проверьте папку спам.
            </div>

            <div class="modal__close">OK</div>
        </div>
    </div>
</body>
</html>