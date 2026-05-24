<?php

require_once("configBD.php");

function login(string $user, string $passwd): bool{
    $conn = getConn();

    try{
        $sql = $conn->prepare("SELECT nombre_usuario, contrasena FROM usuarios WHERE nombre_usuario = ?");

        $sql->bindParam(1, $user);
        $sql->execute();

        while($row = $sql->fetch()){
            if($row["nombre_usuario"] === $user){
                // Comprobación de la contraseña
                if(password_verify($passwd, $row["contrasena"])){
                    return true;
                }else{
                    return false;
                }
            }
        }
    }catch(PDOException){
        
    }finally{
        closeConn($conn);
    }
    return false;
}

function getID(string $user): ?string{
    $conn = getConn();

    try{
        $sql = $conn->prepare("SELECT usuarioID, nombre_usuario FROM usuarios WHERE nombre_usuario = ?");

        $sql->bindParam(1, $user);
        $sql->execute();

        while($row = $sql->fetch()){
            if($row["nombre_usuario"] === $user){
                return (int)$row["usuarioID"];
            }
        }
    }catch(PDOException){

    }finally{
        closeConn($conn);
    }
    return null;
}

function getNombre(string $user): ?string{
    $conn = getConn();

    try{
        $sql = $conn->prepare("SELECT nombre, nombre_usuario FROM usuarios WHERE nombre_usuario = ?");

        $sql->bindParam(1, $user);
        $sql->execute();

        while($row = $sql->fetch()){
            if($row["nombre_usuario"] === $user){
                return $row["nombre"];
            }
        }
    }catch(PDOException){

    }finally{
        closeConn($conn);
    }
    return null;
}

?>