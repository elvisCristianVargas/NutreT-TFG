<?php
/**
 * Clase Principal que extiende de Controller.
 * Esta clase maneja la lógica para la página principal.
 * Contiene un método index que muestra un mensaje de bienvenida.
 */
class Principal extends Controller
{
    /**
     * Constructor de la clase.
     * Llama al constructor de la clase padre.
     */
    public function __construct()
    {
        parent::__construct();
    }
    /**
     * Método index que muestra un mensaje de bienvenida.
     */
    public function index()
    {
        
        new View('Principal', html: true);
        

    }

    public function loginView(){
        $http = new HTTPComponent();
        if($http->getResponse()->getSession()->exists("id")){
            $http->getResponse()->redirect($http->getUrlBase());
        }
        new View(template: 'Login', html: true);
    }

    public function registro(){
        $http = new HTTPComponent();
        if($http->getResponse()->getSession()->exists("id")){
            $http->getResponse()->redirect($http->getUrlBase());
        }
        new View(template: 'Registro', html: true);
    }
    
    public function login(){
        $http = new HTTPComponent();
        $logged = false;
        if($http->getRequest()->getServer("REQUEST_METHOD") === "POST"){
            $params = json_decode(file_get_contents("php://input"), true);
            if(isset($params["user"]) && isset($params["passwd"]) ){

                Loadmodel::load("Principal");
                $modelo = new ModelPrincipal();
                
                // Comprobación de que sean válidos los datos introducidos
                if($modelo->login($params["user"], $params["passwd"])){
                    $logged = true;
                    if(isset($params["recordar"]) && $params["recordar"] === "on"){
                        $http->getRequest()->getCookie()->setCookie("usuario", $params["user"], time() + ((3600 * 24) * 7));
                    }
                    $http->getResponse()->getSession()->set("nombre", $modelo->getNombre([$params["user"]]));
                    $http->getResponse()->getSession()->set("user", $params["user"]);
                    $http->getResponse()->getSession()->set("id", $modelo->getID([$params["user"]]));


                }

                $http->getResponse()->setHeader("Content-type", "application/json");
                $http->getResponse()->setStatusCode(200);
                $response = ["result" => "Correct", "logged" => $logged, "url" => $http->getUrlBase() . ""];
                print json_encode($response);
            }
        }else{
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(405);
            $response = ["result" => "Not found"];
            print json_encode($response);
        }
    }

    public function logged(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "GET"){
            LoadModel::load("Principal");
            $modeloPrincipal = new ModelPrincipal();

            if($http->getResponse()->getSession()->exists("nombre")){
                $logged = true;
            }else $logged = false;
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(200);
            echo json_encode(["result" => $logged, "url" => $http->getUrlBase(), "imagenUser" => $modeloPrincipal->getImagenUser([$http->getResponse()->getSession()->get("id")])]);

        }else{
            if($http->getResponse()->getSession()->exists("nombre")){
                $logged = true;
            }else $logged = false;
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(405);
            echo json_encode(["result" => $logged, "url" => $http->getUrlBase()]);
        }
    }

    public function signIn(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "POST"){
            $params = json_decode(file_get_contents("php://input"), true);
            Loadmodel::load("Principal");
            $modelo = new ModelPrincipal();
            if(isset($params["user"]) && isset($params["passwd"]) && isset($params["email"]) && isset($params["nombre"]) && isset($params["apellidos"])){
                
                if($modelo->register($params["user"], $params["passwd"], $params["email"], $params["nombre"], $params["apellidos"])){
                    $http->getResponse()->getSession()->set("nombre", $modelo->getNombre([$params["user"]]));
                    $http->getResponse()->getSession()->set("user", $params["user"]);
                    $http->getResponse()->getSession()->set("id", $modelo->getID([$params["user"]]));

                    $http->getResponse()->setHeader("Content-type", "application/json");
                    $http->getResponse()->setStatusCode(200);
                    echo json_encode(["result" => "Correct", "url" => $http->getUrlBase()]);
                }else{
                    $http->getResponse()->setHeader("Content-type", "application/json");
                    $http->getResponse()->setStatusCode(200);
                    echo json_encode(["result" => "Error", "url" => $http->getUrlBase()]);
                }
            }else{
                $http->getResponse()->setHeader("Content-type", "application/json");
                $http->getResponse()->setStatusCode(400);
                echo json_encode(["result" => "Bad request"]);
            }

        }
    }

    public function existeUsername(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "POST"){
            $params = json_decode(file_get_contents("php://input"), true);
            Loadmodel::load("Principal");
            $modelo = new ModelPrincipal();

            if(isset($params["user"])){

                if($modelo->existsUsername($params["user"])){

                    $http->getResponse()->setHeader("Content-type", "application/json");
                    $http->getResponse()->setStatusCode(200);
                    echo json_encode(["result" => "Exists"]);
                }else{

                    $http->getResponse()->setHeader("Content-type", "application/json");
                    $http->getResponse()->setStatusCode(200);
                    echo json_encode(["result" => "Not exists"]);
                }

            }else{
                $http->getResponse()->setHeader("Content-type", "application/json");
                $http->getResponse()->setStatusCode(400);
                echo json_encode(["result" => "Bad request"]);
            }

        }
    }

    public function existeEmail(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "POST"){
            $params = json_decode(file_get_contents("php://input"), true);
            Loadmodel::load("Principal");
            $modelo = new ModelPrincipal();

            if(isset($params["email"])){

                if($modelo->existsEmail($params["email"])){

                    $http->getResponse()->setHeader("Content-type", "application/json");
                    $http->getResponse()->setStatusCode(200);
                    echo json_encode(["result" => "Exists"]);
                }else{

                    $http->getResponse()->setHeader("Content-type", "application/json");
                    $http->getResponse()->setStatusCode(200);
                    echo json_encode(["result" => "Not exists"]);
                }

            }else{
                $http->getResponse()->setHeader("Content-type", "application/json");
                $http->getResponse()->setStatusCode(400);
                echo json_encode(["result" => "Bad request"]);
            }

        }
    }
}

?>