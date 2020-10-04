<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Для завершения регистрации подтвердите ваш email</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,700&display=swap" rel="stylesheet">

    <style>

        @media(max-width: 575px){
            .header{
                width: 100% !important;
            }

            .mail-body {
                width: 100% !important;
            }

            .mail-body_h2 {
                font-size: 23px !important;
            }

            .btn {
                border-width: 15px 20px !important;
            }
        }

        /* Для iPhone7 в приложениях */
        @media(max-width: 375px) {
            .mail-body_h2 {
                font-size: 19px !important;
            }

            .mail-body_text {
                font-size: 14px !important;
            }

            .btn {
                font-size: 13px !important;
            }

            .warning {
                font-size: 10px !important;
            }
        }

        @media(min-width: 389px) and (max-width: 468px) {
            .mail-body_h2 {
                font-size: 25px !important;
                padding-right: 60px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0;">
    <!-- Тело таблицы-оболочки --> 
    <table cellspacing="0" cellpadding="0" width="100%" align="center">
        <tr> 
            <td>

                <!-- Header -->
                <table class="header" cellspacing="0" cellpadding="0" width="580" align="center">
                    <tr>
                        <td style="padding-left: 12px;">
                            <!-- Обертка для лого --> <!-- НУЖНО ПОМЕНЯТЬ КАРТИНКУ И ДОБАВИТЬ МАРДЖИНЫ! -->
                            <div style="float: left; vertical-align: bottom;">

                                <a href="https://simple-e-chat.ru.com/">
                                    <img src="https://simple-e-chat.ru.com/slonics.png" alt="logo">
                                </a>
                            </div>

                        </td>

                        <td style="padding-right: 12px;">
                            <!-- Обертка кнопки -->
                            <div style="float: right; vertical-align: bottom;">

                                <div style="margin: 48px 0 36px 0">

                                    <a style="text-decoration: none;" href="https://simple-e-chat.ru.com/registration/">
                                        <!-- Кнопка с бортами -->
                                        <div style="display: inline-block; 
                                        border-style: solid; border-color: #ad66a9; border-width: 8px 30px;
                                        background-color: #ad66a9; color: white; border-radius: 15px;
                                        font-family: 'Roboto', sans-serif; font-size: 12px; font-weight: bold;
                                        text-align: center;">
                                            Войти
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- В следующую строку и ячейку помещаем Тело письма --> 
        <tr>
            <td>
                <table class="mail-body" cellspacing="0" cellpadding="0" width="580" align="center">
                    <tr>
                        <!-- Создаем рамку вокруг тела письма -> Ячейке задаем падинг со всех сторон (ширина рамки) и ложим в нее еще одну таблицу (с белым фоном), где и будет весь контент! -->
                        <td style="padding: 12px;"  bgcolor="#ccccff">

                            <table cellspacing="0" cellpadding="0" width="100%" align="center" bgcolor="white">
                                <tr>
                                    <td style="padding: 35px;" bgcolor="white">
                                        
                                        <div class="mail-body_h2" style="font-family: 'Roboto', sans-serif; 
                                        color: #ad66a9; font-weight: bold; font-size: 27px;">
                                            Приветствуем вас в <a href="https://simple-e-chat.ru.com/">Simple E-chat</a>!
                                        </div>

                                        <div class="mail-body_text" style="margin-top: 24px;
                                        font-family: 'Roboto', sans-serif; color: #ad66a9; font-size: 18px;">
                                            Теперь у вас есть аккаунт в нашем онлайн-мессенджере.
                                            Чтобы активировать его и начать пользоватся чатом, подтвердите ваш email.
                                        </div>

<a style="text-decoration: none; color: white;"href=https://simple-e-chat.ru.com/activation?token=37d437d40fb1a253f2957dc76e9e0ababbb36905da6a50307a83abc55577ed22>
                                            <!-- Кнопка с бортами -->
                                            <div class="btn" style="margin-top: 24px; background-color: #00c084; text-align: center;
                                            font-family: 'Roboto', sans-serif; font-weight: bold; font-size: 20px;
                                            border-color: #00c084; border-style: solid; border-width: 18px 30px; border-radius: 15px;">
                                                Подтвердить email
                                            </div>
                                        </a>

                                        <div class="warning" style="margin-top: 24px;
                                        font-family: 'Roboto', sans-serif; color: #ad66a9; font-size: 12px;">
                                            Если вы не регистрировались и получили это письмо случайно, проигнорируейте его. 
                                        </div>
                                        
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>