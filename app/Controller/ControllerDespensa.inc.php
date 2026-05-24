<?php

class Despensa extends Controller{

    public function __construct()
    {
        parent::__construct();
    }

    public function index(){
        $http = new HTTPComponent();
        if(!$http->getResponse()->getSession()->exists("id")){
            $http->getResponse()->redirect($http->getUrlBase() . "/Principal");
        }else{
            new View(template: "Despensa", html: true);
        }
    }

    public function cargaPagina(){
        $http = new HTTPComponent();

        if ($http->getRequest()->getServer("REQUEST_METHOD") !== "GET"){
            $http->getResponse()->setHeader("Content-type","application/json");
            $http->getResponse()->setStatusCode(405);
            echo json_encode(["result"=>"Method Not Allowed"]);
            return;
        }

        if (!$http->getResponse()->getSession()->exists("id")) {
            $http->getResponse()->setHeader("Content-type","application/json");
            $http->getResponse()->setStatusCode(401);
            echo json_encode(["result"=>"Unauthenticated"]);
            return;
        }

        LoadModel::load("Despensa");
        $modelo = new ModelDespensa();

        $userId = (int)$http->getResponse()->getSession()->get("id");
        $data = [
            "result" => "Correct",
            "ingredientes" => $modelo->getIngredientes(),
            "despensa" => $modelo->getDespensaDeUsuario($userId),
            "url" => $http->getUrlBase()
        ];

        $http->getResponse()->setHeader("Content-type","application/json");
        $http->getResponse()->setStatusCode(200);
        echo json_encode($data, JSON_INVALID_UTF8_SUBSTITUTE);
    }

    public function ingredientes(){
        $http = new HTTPComponent();
        
        if ($http->getRequest()->getServer("REQUEST_METHOD") !== "GET") {
            
            $http->getResponse()->setHeader("Content-type","application/json");
            $http->getResponse()->setStatusCode(405);
            echo json_encode(["result"=>"Method Not Allowed"]);
            return;
        }

        if (!$http->getResponse()->getSession()->exists("id")) {
            $http->getResponse()->setHeader("Content-type","application/json");
            $http->getResponse()->setStatusCode(401);
            echo json_encode(["result"=>"Unauthenticated"]);
            return;
        }

        LoadModel::load("Despensa");
        $modelo = new ModelDespensa();

        $http->getResponse()->setHeader("Content-type","application/json");
        $http->getResponse()->setStatusCode(200);
        echo json_encode(["result"=>"Correct","ingredients" => $modelo->getIngredientes()], JSON_INVALID_UTF8_SUBSTITUTE);
    }

    public function despensa2(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "GET"){
            LoadModel::load("Despensa");
            $modelo = new ModelDespensa();

            
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(200);
            $data = ["result" => "Correct", "despensa" => $modelo->getDespensaDeUsuario($http->getResponse()->getSession()->get("id"))];
            print json_encode($data);
        }else{
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(200);
            $data = ["result" => "Not Found"];
            print json_encode($data);
        }
    }
    
    public function despensa(){
        $http = new HTTPComponent();
        if ($http->getRequest()->getServer("REQUEST_METHOD") !== "GET") {
            
            $http->getResponse()->setHeader("Content-type","application/json");
            $http->getResponse()->setStatusCode(405);
            echo json_encode(["result"=>"Method Not Allowed"]);
            return;
        }

        if (!$http->getResponse()->getSession()->exists("id")) {
            $http->getResponse()->setHeader("Content-type","application/json");
            $http->getResponse()->setStatusCode(401);
            echo json_encode(["result"=>"Unauthenticated"]);
            return;
        }

        LoadModel::load("Despensa");
        $modelo = new ModelDespensa();

        $http->getResponse()->setHeader("Content-type","application/json");
        $http->getResponse()->setStatusCode(200);
        echo json_encode(["result"=>"Correct","ingredients" => $modelo->getDespensaDeUsuario($http->getResponse()->getSession()->get("id"))], JSON_INVALID_UTF8_SUBSTITUTE);
    }

    public function actualizarDespensa(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "PUT"){
            $params = json_decode(file_get_contents("php://input"), true);
            LoadModel::load("Despensa");
            $modelo = new ModelDespensa();

            $resultado = $modelo->actualizarIngrediente($params["despensa"]["ingrediente"], $params["despensa"]["stock"], $params["despensa"]["cantidad"], $params["despensa"]["fecha_insercion"], $params["despensa"]["id"]);

            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(200);
            $data = ["result" => "Correct", "actualizado" => $resultado];
            print json_encode($data);

        }else{
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(405);
            $data = ["result" => "Not found"];
            print json_encode($data);
        }
    }

    public function insertarIngredientes(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "POST"){
            $introducido = true;
            $params = json_decode(file_get_contents("php://input"), true);

            LoadModel::load("Despensa");
            $modelo = new ModelDespensa();

            foreach($params as $producto){

                if($modelo->comprobarVacio($producto)){
                    $modelo->insertIngredientes($http->getResponse()->getSession()->get("id"), $producto["ingrediente"], $producto["cantidad"], $producto["stock"]);
                }else{

                }
            }
            for( $i = 0 ; $i < count($params) ; $i++ ){
                if(!empty($http->getRequest()->getPost("ingredientes")[$i])){
                    $modelo->insertIngredientes($http->getResponse()->getSession()->get("id"), $http->getRequest()->getPost("ingredientes")[$i], $http->getRequest()->getPost("cantidad")[$i], $http->getRequest()->getPost("stock")[$i]);
                    
                }
            }
    
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(200);
            $data = ["result" => "Correct", "introducido" => $introducido];
            print json_encode($data);
        }else{
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(405);
            $data = ["result" => "Not found"];
            print json_encode($data);
        }
    }

    public function filtrarDespensa(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "GET"){
            LoadModel::load("Despensa");
            $modelo = new ModelDespensa();

            
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(200);
            $data = [
                "result" => "Correct",
                "despensa" => $modelo->filtrarDespensa($http->getResponse()->getSession()->get("id"), $http->getRequest()->getGet("filtro"), $http->getRequest()->getGet("orden")),
                "ingredientes" => $modelo->getIngredientes(),
                "url" => $http->getUrlBase()
             ];
            
            print json_encode($data, JSON_INVALID_UTF8_SUBSTITUTE);

        }else{
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(405);
            $data = ["result" => "Not found"];
            print json_encode($data);
        }
    }

    public function eliminarIngrediente(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "DELETE"){
            $params = json_decode(file_get_contents("php://input"), true);
            LoadModel::load("Despensa");
            $modelo = new ModelDespensa();

            $resultado = $modelo->eliminarIngrediente($params["id"]);

            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(200);
            $data = ["result" => "Correct", "eliminado" => $resultado];
            print json_encode($data);

        }else{
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(405);
            $data = ["result" => "Not found"];
            print json_encode($data);
        }
    }

    public function totalIngredientesDespensa(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "GET"){
            LoadModel::load("Despensa");
            $modeloDespensa = new ModelDespensa();

            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(200);
            $data = ["result" => "Correct", "totalIngredientes" => $modeloDespensa->getTotalIngredientesDespensa($http->getResponse()->getSession()->get("id"))];
            print json_encode($data);
        }else{
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(405);
            $data = ["result" => "Not found"];
            print json_encode($data);
        }
    }
}

?>