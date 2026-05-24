<?php

require_once("configBD.php");

function getIngredienteID(string $nombre): ?string{
    $conn = getConn();

    try{
        $sql = $conn->prepare("SELECT nombre, ingredienteID FROM ingredientes WHERE nombre = ?");

        $sql->bindParam(1, $nombre);

        $sql->execute();

        while($row = $sql->fetch()){
            if($row["nombre"] == $nombre){

                return $row["ingredienteID"];
            }
        }
    }catch(PDOException){

    }finally{
        closeConn($conn);
    }
    return null;
}
function getIngredientes(): ?array{
    $conn = getConn();
    
    $ingredientes = [];
    try{
        $sql = $conn->prepare("SELECT ingredienteID, nombre, medicion FROM ingredientes ORDER BY nombre");

        $sql->execute();

        while($row = $sql->fetch()){
            $ingredientes[$row["ingredienteID"]] = [
                "nombre" => $row["nombre"],
                "medicion" => $row["medicion"]
            ];
        }

        return $ingredientes;

    }catch(PDOException){

    }finally{
        closeConn($conn);
    }
    return null;
}

if (isset($_GET['accion']) && $_GET['accion'] == 'getIngredientes') {
    // Llamamos a la función y devolvemos los ingredientes como JSON
    echo json_encode(getIngredientes());
}

function existeIngredienteEnDespensa(int $user, int $ingrediente, int $cantidad): bool{
    $conn = getConn();

    try{
        $sql = $conn->prepare("SELECT COUNT(*) FROM despensa WHERE usuarioID = ? AND ingredienteID = ? AND cantidad = ? AND fecha_insercion = CURDATE()");

        $sql->bindParam(1, $user);
        $sql->bindParam(2, $ingrediente);
        $sql->bindParam(3, $cantidad);

        $sql->execute();

        return $sql->fetchColumn() > 0;
        
    }catch(PDOException){

    }finally{
        closeConn($conn);
    }
    return false;
}

/**
 * Summary of getStock
 * @param int $user
 * @param int $ingrediente
 * @return int
 * @deprecated No se utiliza
 */
function getStock(int $user, int $ingrediente): int{
    $conn = getConn();

    try{
        $sql = $conn->prepare("SELECT * FROM despensa WHERE usuarioID = ?");

        $sql->bindParam(1, $user);

        $sql->execute();

        while($row = $sql->fetch()){
            if($row["ingredienteID"] === $ingrediente){
                return (int)$row["stock"];
            }
        }
        
    }catch(PDOException){

    }finally{
        closeConn($conn);
    }
    return 0;
}

function insertIngredientes(int $user, int $ingredienteID, int $cantidad, int $stock){
    $conn = getConn();

    try{
        if(existeIngredienteEnDespensa($user, $ingredienteID, $cantidad)){

            $sql = $conn->prepare("UPDATE despensa SET stock += ? WHERE usuarioID = ? AND ingredienteID = ? AND cantidad = ? AND fecha_insercion = CURDATE()");

            $sql->bindParam(1, $stock);
            $sql->bindParam(2, $user);
            $sql->bindParam(3, $ingredienteID);

            $sql->execute();
        }else{

            $sql = $conn->prepare("INSERT INTO despensa(usuarioID, ingredienteID, stock, cantidad, fecha_insercion) 
            values(?, ?, ?, ?, CURDATE())");

            $sql->bindParam(1, $user);
            $sql->bindParam(2, $ingredienteID);
            $sql->bindParam(3, $stock);
            $sql->bindParam(4, $cantidad);

            $sql->execute();
        }
    }catch(PDOException){

    }finally{
        closeConn($conn);
    }
}

function getDespensaDeUsuario(int $userID): ?array{
    $conn = getConn();

    try{
        $sql = $conn->prepare("SELECT ig.nombre, ig.ingredienteID, ds.stock, ds.cantidad, DATE_FORMAT(fecha_insercion, '%d-%m-%Y') as fecha
        FROM despensa ds JOIN ingredientes ig ON ds.ingredienteID = ig.ingredienteID WHERE ds.usuarioID = ?");
    

        $sql->bindParam(1, $userID);

        $sql->execute();

        $despensa = [];

        while($row = $sql->fetch()){
            $despensa[] = [
                "nombre" => $row["nombre"], 
                "ingredienteID" => $row["ingredienteID"],
                "stock" => $row["stock"], 
                "cantidad" => $row["cantidad"], 
                "fecha_insercion" => $row["fecha"]
            ];
        }
        return $despensa;

    }catch(PDOException){

    }finally{
        closeConn($conn);
    }
    return null;
}

function getDespensaUsuarioSoloNombresDeIngredientes(int $userID): ?array{
    $conn = getConn();

    try{
        $sql = $conn->prepare("SELECT ig.nombre, ds.stock, ds.cantidad
        FROM despensa ds JOIN ingredientes ig ON ds.ingredienteID = ig.ingredienteID WHERE ds.usuarioID = ?");
    

        $sql->bindParam(1, $userID);

        $sql->execute();

        $despensa = [];

        while($row = $sql->fetch()){
            $cantidad = 0;
            if($row["stock"] > 1){
                $cantidad = $row["stock"] * $row["cantidad"];
            }
            if(array_key_exists($row["nombre"], $despensa)){
                $cantidad += $despensa[$row["nombre"]];

            }
            $despensa[$row["nombre"]] = $cantidad;
        }
        return $despensa;

    }catch(PDOException){

    }finally{
        closeConn($conn);
    }
    return null;
}

function actualizarIngrediente(int $ingredienteID, int $stock, int $cantidad, $fecha_insercion,
                                int $user, int $ingredientePrev, int $cantidadPrev, $fecha_insercionPrev): bool{
    $conn = getConn();

    try{
        $sql = $conn->prepare("UPDATE despensa 
        SET ingredienteID = ?, stock = ?, cantidad = ?, fecha_insercion = ?
        WHERE usuarioID = ? AND ingredienteID = ? AND cantidad = ? AND fecha_insercion = ?");

        $fecha = new DateTime($fecha_insercion);
        $f1 = $fecha->format('Y-m-d');
        $fechaPrev = new DateTime($fecha_insercionPrev);
        $f2 = $fechaPrev->format('Y-m-d');

        $sql->bindParam(1, $ingredienteID, PDO::PARAM_INT);
        $sql->bindParam(2, $stock, PDO::PARAM_INT);
        $sql->bindParam(3, $cantidad, PDO::PARAM_INT);
        $sql->bindParam(4, $f1);
        
        $sql->bindParam(5, $user, PDO::PARAM_INT);
        $sql->bindParam(6, $ingredientePrev, PDO::PARAM_INT);
        $sql->bindParam(7, $cantidadPrev, PDO::PARAM_INT);
        $sql->bindParam(8, $f2);

        $sql->execute();
        print "ejecuta<br>";
        
        return true;
        
    }catch(PDOException){

    }finally{
        closeConn($conn);
    }
    return false;
}

function getStringIngredientes(int $id): ?string{
    $conn = getConn();
    
    $ingredientes = "";
    try{
        $sql = $conn->prepare("SELECT ingredienteID, nombre FROM ingredientes");

        $sql->execute();

        while($row = $sql->fetch()){
            if($row["ingredienteID"] == $id){
                $option = "<option value='" . $row["ingredienteID"] . "' selected>" . $row["nombre"] . "</option>";

            }else{
                $option = "<option value='" . $row["ingredienteID"] . "'>" . $row["nombre"] . "</option>";

            }
            $ingredientes .= $option;
        }

        return $ingredientes;

    }catch(PDOException){

    }finally{
        closeConn($conn);
    }
    return null;
}

?>