<?php

class ModelPrincipal extends Model{

    public function __construct(){
        parent::__construct();
    }

    public function login(string $usuario, string $pass){
        $res = $this->query("SELECT nombre_usuario, contrasena FROM usuarios WHERE nombre_usuario = ?", [$usuario]);
        foreach($res as $usu){
            if(password_verify($pass, $usu["contrasena"])){
                return true;
            }else{
                return false;
            }
        }
    }

    public function getID(array $data){
        $res = $this->query("SELECT usuarioID, nombre_usuario FROM usuarios WHERE nombre_usuario = ?", $data);

        foreach($res as $usu){
            if($usu["nombre_usuario"] === $data[0]){
                return (int)$usu["usuarioID"];
            }
        }
    }

    public function getNombre(array $data){
        $res = $this->query("SELECT nombre, nombre_usuario FROM usuarios WHERE nombre_usuario = ?", $data);
        foreach($res as $usu){
            if($usu["nombre_usuario"] === $data[0]){
                return $usu["nombre"];
            }
        }
    }

    public function register(string $user, string $pass, string $email, string $nombre, string $apellidos){
        $res = $this->query("INSERT INTO usuarios (nombre_usuario, contrasena, email, nombre, apellidos) VALUES (?, ?, ?, ?, ?)", [$user, password_hash($pass, PASSWORD_BCRYPT), $email, $nombre, $apellidos]);

        if($res){
            return true;
        }
        return false;
    }

    public function existsUsername(string $user){
        $res = $this->query("SELECT nombre_usuario FROM usuarios WHERE nombre_usuario = ?", [$user]);
        foreach($res as $usu){
            if($usu["nombre_usuario"] === $user){
                return true;
            }
        }
        return false;
    }

    public function existsEmail(string $email){
        $res = $this->query("SELECT email FROM usuarios WHERE email = ?", [$email]);
        foreach($res as $usu){
            if($usu["email"] === $email){
                return true;
            }
        }
        return false;
    }

    public function getImagenUser(array $data){
        $res = $this->query("SELECT imagen, usuarioID FROM usuarios WHERE usuarioID = ?", $data);
        foreach($res as $usu){
            if($usu["usuarioID"] === $data[0]){
                return $usu["imagen"];
            }
        }
    }
}

?>