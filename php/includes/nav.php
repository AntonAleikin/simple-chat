<!-- Навигационное меню -->
<nav class="header-nav">
        
    <div class="hamburger"><!--  Мобильное меню -->
        <span></span>
        <span></span>
        <span></span>
    </div>

    <ul class="menu">
        <!-- Левая секция меню -->
        <div class="menu__section-left">

            <li class="menu__item">
                <a href="/" class="menu__link menu__link-home">Главная</a>
            </li>

            <li class="menu__item">
                <a href="/chat" class="menu__link menu__link-chat border">Чат</a>
            </li>
        </div>
        
        
        <!-- Правая секция меню -->
        <div class="menu___section-right">

            <?php
                if ($_SESSION['login'] === true && !empty($_SESSION['email']) && isset($_SESSION['email'])) { 
            ?>

                <!-- Личный кабинет (показываем после логина) -->
                <li class="menu__item">
                    <a href="/account" class="menu__link menu__link-account">
                        Личный кабинет
                    </a>
                </li>
                
            <?php 
                } else { 
            ?> 

                <!-- Шапка меню без логина и сессии -->
                <li class="menu__item">
                    <a href="/registration" class="menu__link menu__link-registration">
                        Зарегистрироваться
                    </a>
                </li>

                <li class="menu__item">
                    <a href="/login" class="menu__link menu__link-login border">Войти</a>
                </li> 

            <?php 
                } 
            ?> 

        </div>
    </ul>
</nav>