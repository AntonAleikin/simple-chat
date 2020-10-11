<?php 
    session_start();

    if ($_SESSION['login'] === true && !empty($_SESSION['email']) && isset($_SESSION['email']) && 
    !empty($_SESSION['username']) && isset($_SESSION['username'])) {
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account</title>
    <?php include './php/includes/main_head.php'?>
</head>

<body>
    <!-- Header -->
    <div class="container">
        
        <header class="header">
            <?php include './php/includes/nav.php'?>
        </header>

        <!-- Проверяем, есть ли в сессии авторизация и верификация и только тогда показываем контент  -->
        <?php    
            echo 'Шалости удались! <br>'. $_SESSION['email'] .'<br>'. $_SESSION['username']
            .'<br>'. $_SESSION['verified'];

            // Чтобы удалить сессию - ф-ция session_destroy(); Обычно после выхода пользователя из системы 
        ?>

    </div>
</body>
</html>

<?php 
    } else {

        // Если НЕ во время сессии перейти по ссылке на эту ст - попадем на главную
        header("Location: /");
    }
?>