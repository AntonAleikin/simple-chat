<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple E-chat</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="../../css/bootstrap-grid.min.css">
    <link rel="stylesheet" href="../../css/main.min.css">
    <script defer src="js/nav.js"></script>
</head>

<body>
    <!-- Header -->
    <div class="container">
        <Header>
            <!-- Навигационное меню -->
            <nav class="header_nav">
                
                <div class="hamburger"><!--  Мобильное меню -->
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <ul class="menu">
                    <!-- Левая секция меню -->
                    <div class="menu_section_left">

                        <li class="menu_item">
                            <a href="/" class="menu_link home">Главная</a>
                        </li>
                    </div>
                    
                    <!-- Правая секция меню -->
                    <div class="menu_section_right">

                        <li class="menu_item">
                            <a href="/registration.php" class="menu_link registration">
                                Зарегистрироваться
                            </a>
                        </li>

                        <li class="menu_item">
                            <a href="/login.php" class="menu_link login border">Войти</a>
                        </li>
                    </div>
                </ul>
            </nav>
        </Header>

        <!-- Оповещение об успешной активации -->
        <div class="activation">

            <div class="activation__text">
                Поздравляем, ваш аккаунт успешно активирован! <br>
                <a href="/login.php">Авторизируйтесь</a> , чтобы начать пользоватся чатом. 
            </div>
        </div>
    </div>
     
</body>
</html>