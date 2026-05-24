<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="<?= $http->getUrlBase() ?>/public/css/styles.css">
        <script defer src="<?= $http->getUrlBase() ?>/public/js/despensa.js"></script>
        <title>NutreT</title>
    </head>
    <body>
        <header>
            <nav class="nav">
                <div class="divnav">
                    <a class="enlaces" href="<?= $http->getUrlBase() ?>/Despensa">Despensa</a>
                    <a class="enlaces" href="">Recetas</a>
                    <a class="enlaces" href="<?= $http->getUrlBase() ?>/Generar">Generar</a>
                </div>
                <div class="divnav">
                    <?php if(isset($data) && $data){ ?>
                    <a href="" class="enlaces"><img class="iconoPerfil" src="<?= $http->getUrlBase() ?>/public/img/LucideUser.png" alt="Icono de el usuario" style="height: 2.5vh; width: 2.5vh;"></a>
                    <?php }else{ ?>
                    <a class="enlaces" href="<?= $http->getUrlBase() ?>/Principal/login">Inicio Sesión</a>
                    <a class="enlaces" id="registro" href="">Registrarse</a>
                    <?php } ?>
                </div>
            </nav>
        </header>
        <main class="principal">