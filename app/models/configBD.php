<?php

$host = "127.0.0.1";
$user = "root";
$bd = "nutret";
$pass = "";

function getConn(): ?PDO{
    global $host, $user, $bd, $pass;
    try{
        $conn = new PDO("mysql:host=$host;dbname=$bd", $user, $pass);

        return $conn;
    }catch(PDOException){
        print "Ha ocurrido algo inesperado";
    }
    return null;
}

function closeConn(PDO $conn): void{
    $conn = null;
}

?>