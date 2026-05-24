<?php
ob_start();
require_once 'app/Core/php_errors.php';
/**
 * Archivo de entrada principal del framework MVC.
 * Este archivo se encarga de cargar los componentes esenciales del framework,
 * determinar el controlador por defecto y ejecutar la lógica correspondiente.
 */
ob_start();
require_once 'app/Core/HTTPComponent.inc.php';
require_once 'app/Core/Controller.inc.php';
require_once 'app/Core/View.inc.php';
require_once 'app/Core/Model.inc.php';
require_once 'app/Core/LoadModel.inc.php';
require_once 'vendor/autoload.php';

// Instanciar el componente HTTP. Se encarga de manejar las solicitudes y respuestas HTTP.
$http = new HTTPComponent();

// Determinar el controlador por defecto basado en el parámetro GET 'controller'.
if(isset($http->getRequest()->getGet()['controller']) && !empty($http->getRequest()->getGet()))
    $controller = $http->getRequest()->getGet('controller');
// Si no se especifica ningún controlador, usar 'Principal' por defecto
else $controller = 'Principal';

// No fuerces un controlador cuando no hay sesión.
// El control de acceso queda en cada controlador/acción para poder devolver 401 JSON en APIs.


// Incluir el archivo del controlador correspondiente.
if(file_exists('app/Controller/Controller' . $controller . '.inc.php'))
    require_once 'app/Controller/Controller' . $controller . '.inc.php';
// Si el archivo no existe, mostrar un mensaje de error.
else {
    $viewError = new View('Error');
    die();
}

// Instanciar el controlador por defecto.
$instance = new $controller();
?>


