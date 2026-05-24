<?php

class Recetas extends Controller {

    public function __construct(){
        parent::__construct();
    }

    public function index(){
        $http = new HTTPComponent();
        if(!$http->getResponse()->getSession()->exists("id")){
            $http->getResponse()->redirect($http->getUrlBase() . "");
        }else{
            new View(template: "Recetas", html: true);
        }
    }

    public function guardar(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "POST"){
            $params = json_decode(file_get_contents("php://input"), true); // Leer el cuerpo de la solicitud para limpiar el flujo de entrada
            LoadModel::load("Recetas");
            $modeloRecetas = new ModelRecetas();
            $json = json_encode($params, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            $nombreArchivo = "receta_" . $http->getResponse()->getSession()->get("id") . "_" . time() . ".json";

            $resultado = file_put_contents("/var/www/html/storage/recipes/" . $nombreArchivo, $json);

            $modeloRecetas->guardarReceta($params['receta'], $http->getResponse()->getSession()->get("id"), $nombreArchivo);
            
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(200);
            $data = ["result" => "Correct", "recetaGuardada" => true, "nombreArchivo" => $nombreArchivo];
            print json_encode($data);
        }else{
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(405);
            $data = ["result" => "Not found"];
            print json_encode($data);
        }
    }

    public function recetasGeneradas(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "GET"){
            LoadModel::load("Recetas");
            $modeloRecetas = new ModelRecetas();
            $recetasGeneradas = $modeloRecetas->getRecetasGeneradas($http->getResponse()->getSession()->get("id"), $http->getUrlBase());
            
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(200);
            $data = ["result" => "Correct", "recetasGeneradas" => $recetasGeneradas];
            print json_encode($data);

        }else{
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(405);
            $data = ["result" => "Not found"];
            print json_encode($data);
        }
    }

    public function guardarFavorito(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "POST"){
            $params = json_decode(file_get_contents("php://input"), true); // Leer el cuerpo de la solicitud para limpiar el flujo de entrada
            LoadModel::load("Recetas");
            $modeloRecetas = new ModelRecetas();
            if(isset($http->getRequest()->getGet()["option"])){

                $modeloRecetas->guardarRecetaFavorita($http->getResponse()->getSession()->get("id"), (int)$http->getRequest()->getGet("option"), $params["calificacion"], $params["comentario"]);
            }else{
                    
                $recetaID = $modeloRecetas->getIdReceta($http->getResponse()->getSession()->get("id"), $params["nombreArchivo"]);

                $modeloRecetas->guardarRecetaFavorita($http->getResponse()->getSession()->get("id"), $recetaID, $params["calificacion"], $params["comentario"]);

            }

            
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(200);
            $data = ["result" => "Correct"];
            print json_encode($data);
        }else{
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(405);
            $data = ["result" => "Not found"];
            print json_encode($data);
        }
    }

    public function recetaGenerada(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "GET"){
            LoadModel::load("Recetas");
            $modeloRecetas = new ModelRecetas();
            $recetaGenerada = $modeloRecetas->getRecetaPorId($http->getRequest()->getGet("option"), $http->getUrlBase());

            $esFavorito = $modeloRecetas->isFavourite($http->getRequest()->getGet("option"));
            $favoritoData = $modeloRecetas->getFavoritoData($http->getResponse()->getSession()->get("id"), (int)$http->getRequest()->getGet("option"));
            
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(200);
            $data = ["result" => "Correct", "recetaGenerada" => $recetaGenerada, "esFavorito" => $esFavorito, "calificacion" => $favoritoData["calificacion"] ?? null, "comentario" => $favoritoData["comentario"] ?? null];
            print json_encode($data);

        }else{
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(405);
            $data = ["result" => "Not found"];
            print json_encode($data);
        }
    }

    public function guardarImagen(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "POST"){
            $recetaId = $http->getRequest()->getGet("option");
            $imagen = $http->getRequest()->getFiles("imagen");
            LoadModel::load("Recetas");
            $modeloRecetas = new ModelRecetas();

            if(isset($recetaId) && isset($imagen)){
                $nombreArchivoAnterior = $modeloRecetas->getImagenReceta((int)$recetaId);
                if($nombreArchivoAnterior !== null){
                    unlink("/var/www/html/storage/uploads/recipeImages/" . $nombreArchivoAnterior);

                }
                $nombreArchivo = "image_" . $http->getResponse()->getSession()->get("id") . "_" . time() . ".jpg";
                move_uploaded_file($imagen["tmp_name"], "/var/www/html/storage/uploads/recipeImages/" . $nombreArchivo);

                $modeloRecetas->guardarImagenReceta((int)$recetaId, $nombreArchivo);
            }

            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(200);
            $data = ["result" => "Correct"];
            print json_encode($data);
        }else{
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(405);
            $data = ["result" => "Not found"];
            print json_encode($data);
        }
    }

    public function recetasFavoritas(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "GET"){
            LoadModel::load("Recetas");
            $modeloRecetas = new ModelRecetas();

            $recetasFavoritas = $modeloRecetas->getRecetasFavoritas($http->getResponse()->getSession()->get("id"), $http->getUrlBase());

            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(200);
            $data = ["result" => "Correct", "recetasFavoritas" => $recetasFavoritas];
            print json_encode($data);
        }else{
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(405);
            $data = ["result" => "Not found"];
            print json_encode($data);
        }
    }

    public function eliminarFavorito(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "DELETE"){
            $params = json_decode(file_get_contents("php://input"), true);
            LoadModel::load("Recetas");
            $modeloRecetas = new ModelRecetas();

            $modeloRecetas->eliminarRecetaFavorita($http->getResponse()->getSession()->get("id"), $http->getRequest()->getGet("option"));

            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(200);
            $data = ["result" => "Correct"];
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