<?php

class Perfil extends Controller{
    public function __construct()
    {
        parent::__construct();
    }
    
    // FINALTODO: Agregar datos biometricos, para que la ia pueda recomendar mejores dietas. Rollo peso, altura, edad, sexo, actividad fisica, etc.

    public function index(){
        $http = new HTTPComponent();
        if(!$http->getResponse()->getSession()->exists("id")){
            $http->getResponse()->redirect($http->getUrlBase() . "");
        }else{
            new View(template: "Perfil", html: true);
        }
    }

    public function datosUsuario(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "GET"){
            LoadModel::load("Perfil");
            $modeloPerfil = new ModelPerfil();

            $datosUsuario = $modeloPerfil->getDatosUsuario($http->getResponse()->getSession()->get("id"));

            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(200);
            $response = ["result" => "Correct", "datosUsuario" => $datosUsuario, "url" => $http->getUrlBase()];
            print json_encode($response);
        }else{
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(405);
            $response = ["result" => "Not found"];
            print json_encode($response);
        }
    }

    public function actualizarDatosUsuario(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "PUT"){
            $params = json_decode(file_get_contents("php://input"), true);
            LoadModel::load("Perfil");
            $modeloPerfil = new ModelPerfil();

            $modeloPerfil->actualizarDatosUsuario($params["user"], $params["email"], $params["nombre"], $params["apellidos"], $http->getResponse()->getSession()->get("id"));

            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(200);
            $response = ["result" => "Correct"];
            print json_encode($response);
        }else{
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(405);
            $response = ["result" => "Not found"];
            print json_encode($response);
        }
    }
    
    public function subirFoto(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "POST"){
            LoadModel::load("Perfil");
            $modeloPerfil = new ModelPerfil();
            LoadModel::load("Principal");
            $modeloPrincipal = new ModelPrincipal();
            $imagen = $http->getRequest()->getFiles("imagen");

            if(isset($imagen)){
                $nombreArchivoAnterior = $modeloPrincipal->getImagenUser([$http->getResponse()->getSession()->get("id")]);
                if($nombreArchivoAnterior !== null){
                    unlink("storage/uploads/profile/" . $nombreArchivoAnterior);

                }
                $nombreArchivo = "image_" . $http->getResponse()->getSession()->get("id") . "_" . time() . ".jpg";
                move_uploaded_file($imagen["tmp_name"], "storage/uploads/profile/" . $nombreArchivo);

                $modeloPerfil->insertarFoto($nombreArchivo, $http->getResponse()->getSession()->get("id"));
            }
            

            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(200);
            $response = ["result" => "Correct", "url" => $http->getUrlBase(), "nombreFoto" => $nombreArchivo];
            print json_encode($response);
        }else{
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(405);
            $response = ["result" => "Not found"];
            print json_encode($response);
        }
    }

    public function infoUsuario(){
        $http = new HTTPComponent();
        if($http->getRequest()->getServer("REQUEST_METHOD") === "GET"){
            LoadModel::load("Perfil");
            $modeloPerfil = new ModelPerfil();

            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(200);
            $response = ["result" => "Correct", "recetasGeneradas" => $modeloPerfil->getRecetasGeneradas($http->getResponse()->getSession()->get("id")), "recetasFavoritas" => $modeloPerfil->getRecetasFavoritas($http->getResponse()->getSession()->get("id"))];
            print json_encode($response);
        }else{
            $http->getResponse()->setHeader("Content-type", "application/json");
            $http->getResponse()->setStatusCode(405);
            $response = ["result" => "Not found"];
            print json_encode($response);
        }
    }

    public function logOut(){
        $http = new HTTPComponent();

        $http->getResponse()->getSession()->destroy();


        $http->getResponse()->setHeader("Content-type", "application/json");
        $http->getResponse()->setStatusCode(200);
        $response = ["result" => "Correct", "url" => $http->getUrlBase()];
        print json_encode($response);
    }
}

?>