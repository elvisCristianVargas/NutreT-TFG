<?php

require_once 'Cookie.inc.php';

/**
 * Clase Request
 *
 * Esta clase maneja los datos de la solicitud HTTP, incluyendo variables GET, POST, SERVER y cookies.
 */
class Request 
{
    // Propiedades para almacenar los datos de la solicitud
    private array $get;
    private array $post;
    private array $server;
    private Cookie $cookies;

    private array $files; 

    /**
     * Constructor de la clase Request
     * Inicializa las propiedades con los datos de la solicitud HTTP
     */
    public function __construct()
    {
        $this->get = $_GET;
        $this->post = $_POST;
        $this->server = $_SERVER;
        $this->cookies = new Cookie();
        $this->files = $_FILES;
    }

    /**
     * Obtiene un valor específico de las variables GET o todas si no se proporciona una clave.
     */
    public function getGet(string $key = ""): mixed
    {
        return $this->get[$key] ?? $this->get;
    }

    /**
     * Obtiene un valor específico de las variables POST o todas si no se proporciona una clave.
     */
    public function getPost(string $key = ""): mixed
    {
        return $this->post[$key] ?? $this->post;
    }

    /**
     * Obtiene un valor específico de las variables SERVER o todas si no se proporciona una clave.
     */
    public function getServer(string $key = ""): mixed
    {
        return $this->server[$key] ?? $this->server;
    }

    /**
     * Obtiene el objeto Cookie para manejar las cookies de la solicitud.
     */
    public function getCookie(): Cookie
    {
        return $this->cookies;
    }

    public function getFiles(string $key = ""): mixed
    {
        return $this->files[$key] ?? $this->files;
    }
}

?>



