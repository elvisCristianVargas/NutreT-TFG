<?php

class ModelPerfil extends Model{

    public function __construct()
    {
        parent::__construct();
    }

    public function getDatosUsuario(int $userId){
        $res = $this->query("SELECT nombre_usuario, email, nombre, apellidos, imagen FROM usuarios WHERE usuarioID = ?", [$userId]);
        $datosUsuario = [];
        foreach($res as $usu){
            $datosUsuario = ["user" => $usu["nombre_usuario"], "email" => $usu["email"], "nombre" => $usu["nombre"], "apellidos" => $usu["apellidos"], "imagen" => $usu["imagen"]];
        }
        return $datosUsuario;
    }

    public function actualizarDatosUsuario(string $user, string $email, string $nombre, string $apellidos, int $userID){
        $this->query("UPDATE usuarios SET nombre_usuario = ?, email = ?, nombre = ?, apellidos = ? WHERE usuarioID = ?", [$user, $email, $nombre, $apellidos, $userID]);
    }

    public function insertarFoto(string $nombreArchivo, int $userId){
        $this->query("UPDATE usuarios SET imagen = ? WHERE usuarioID = ?", [$nombreArchivo, $userId]);
    }

    public function getRecetasGeneradas(int $userId){
        $res = $this->query("SELECT COUNT(*) AS total FROM recetas WHERE usuarioID = ?", [$userId]);
        return $res[0]["total"];
    }

    public function getRecetasFavoritas(int $userId){
        $res = $this->query("SELECT COUNT(*) AS total FROM es_favorito WHERE usuarioID = ?", [$userId]);
        return $res[0]["total"];
    }
}

?>