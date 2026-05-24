<?php
class Generar extends Controller{
    
    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $http = new HTTPComponent();
        if(!$http->getResponse()->getSession()->exists("id")){
            $http->getResponse()->redirect($http->getUrlBase() . "");
        }else{
            new View(template: "Generar", html: true);
        }
    }

    public function generarRecetas(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "POST"){
            $params = json_decode(file_get_contents("php://input"), true); // Leer el cuerpo de la solicitud para limpiar el flujo de entrada
            LoadModel::load("Generar");
            $modeloGenerar = new ModelGenerar();
            LoadModel::load("Despensa");
            $modeloDespensa = new ModelDespensa();
            
            if($modeloGenerar->getPeticionesRestantes($http->getResponse()->getSession()->get("id")) >= 1){
                $modeloGenerar->restarPeticion($http->getResponse()->getSession()->get("id"));

            }else{
                $http->getResponse()->setHeader("Content-type", "application/json");
                $http->getResponse()->setStatusCode(403);
                $data = ["result" => "No more requests allowed"];
                print json_encode($data);
                exit;
            }

            $receta = $modeloGenerar->generarPrompt($modeloDespensa->getDespensaDeUsuario($http->getResponse()->getSession()->get("id")), $params["caracteristicas"], $params["recetasExcluidas"]);


            $receta = $modeloGenerar->limpiarRespuestaAI($receta);
            
            error_log($receta);
            try {
                $recetaArray = $modeloGenerar->leerArchivoTOON($receta);
            } catch (\Exception $e) {
                $modeloGenerar->sumarPeticion($http->getResponse()->getSession()->get("id"));
                $http->getResponse()->setHeader("Content-type", "application/json");
                $http->getResponse()->setStatusCode(200);
                print json_encode(["result" => "Error generating recipe"]);
                exit;
            }

            if($recetaArray["recipe"] === null){
                $modeloGenerar->sumarPeticion($http->getResponse()->getSession()->get("id"));
                $http->getResponse()->setHeader("Content-type", "application/json");
                $http->getResponse()->setStatusCode(500);
                $data = ["result" => "Error generating recipe"];
                print json_encode($data);
                exit;
            }

            $categoria = $modeloGenerar->obtenerCategoriaReceta($recetaArray);

            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(200);
            $data = ["result" => "Correct", "recetaEnviada" => true, "receta" => $recetaArray, "categoria" => $categoria];
            print json_encode($data);
        }else{
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(405);
            $data = ["result" => "Not found"];
            print json_encode($data);
        }
    }
    
    public function getPeticionesRestantes(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "GET"){
            LoadModel::load("Generar");
            $modeloGenerar = new ModelGenerar();
            $peticionesRestantes = $modeloGenerar->getPeticionesRestantes($http->getResponse()->getSession()->get("id"));
            
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(200);
            $data = ["result" => "Correct", "peticionesRestantes" => $peticionesRestantes];
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