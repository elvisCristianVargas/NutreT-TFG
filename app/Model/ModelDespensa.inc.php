<?php

class ModelDespensa extends Model{

    public function __construct()
    {
        parent::__construct();
    }

    public function comprobarVacio(array $producto): bool {
        if(empty($producto["ingrediente"])){
            return false; // Sin ingrediente, no es válido
        }
        if($producto["cantidad"] <= 0 || $producto["stock"] <= 0){
            return false; // Cantidad o stock inválidos
        }
        return true;
    }

    public function getIngredienteID(string $nombre): ?string{
        $res = $this->query("SELECT nombre, ingredienteID FROM ingredientes WHERE nombre = ?", [$nombre]);
        foreach($res as $r){
            if($r["nombre"] == $nombre){

                return $r["ingredienteID"];
            }
        }
        return null;
    }

    public function getIngredientes(): ?array{
        $ingredientes = [];
        $res = $this->query("SELECT ingredienteID, nombre, medicion FROM ingredientes ORDER BY nombre");
        foreach($res as $r){
            $ingredientes[$r["ingredienteID"]] = [ "nombre" => $r["nombre"], "medicion" => $r["medicion"] ];
        }
        return $ingredientes;
    }

    public function existeIngredienteEnDespensa(int $user, int $ingrediente, int $cantidad): bool {
        $res = $this->query("SELECT COUNT(*) as total FROM despensa WHERE usuarioID = ? AND ingredienteID = ? AND cantidad = ? AND fecha_insercion = CURDATE()", [$user, $ingrediente, $cantidad]);
        
        return $res[0]["total"] > 0;
    }

    public function getStock(int $user, int $ingrediente): int{
        $res = $this->query("SELECT * FROM despensa WHERE usuarioID = ?", [$user]);

        foreach($res as $r){
            if($r["ingredienteID"] === $ingrediente){
                return (int)$r["stock"];
            }
        }
        return 0;
    }

    public function insertIngredientes(int $user, int $ingredienteID, int $cantidad, int $stock){
        if($this->existeIngredienteEnDespensa($user, $ingredienteID, $cantidad)){
            $this->query("UPDATE despensa SET stock = (stock + ?) WHERE usuarioID = ? AND ingredienteID = ? AND cantidad = ? AND fecha_insercion = CURDATE()", [$stock, $user, $ingredienteID, $cantidad]);
        }else{
            $this->query("INSERT INTO despensa(usuarioID, ingredienteID, stock, cantidad, fecha_insercion) 
            values(?, ?, ?, ?, CURDATE())", [$user, $ingredienteID, $stock, $cantidad]);
        }
    }

    public function getDespensaDeUsuario(int $userID): ?array{
        $res = $this->query("SELECT ds.despensaID, ig.nombre, ig.ingredienteID, ig.medicion, ds.stock, ds.cantidad, DATE_FORMAT(fecha_insercion, '%d-%m-%Y') as fecha
        FROM despensa ds JOIN ingredientes ig ON ds.ingredienteID = ig.ingredienteID WHERE ds.usuarioID = ?", [$userID]);

        $despensa = [];

        foreach($res as $r){
            $despensa[] = [
                "despensaID" => $r["despensaID"],
                "nombre" => $r["nombre"], 
                "ingredienteID" => $r["ingredienteID"],
                "medicion" => $r["medicion"],
                "stock" => $r["stock"], 
                "cantidad" => $r["cantidad"], 
                "fecha_insercion" => $r["fecha"]
            ];
        }
        return $despensa;
    }

    public function getDespensaUsuarioSoloNombresDeIngredientes(int $userID): ?array{
        $res = $this->query("SELECT ig.nombre, ds.stock, ds.cantidad
        FROM despensa ds JOIN ingredientes ig ON ds.ingredienteID = ig.ingredienteID WHERE ds.usuarioID = ?", [$userID]);

        $despensa = [];

        foreach($res as $r){
            $cantidad = 0;
            if($r["stock"] > 1){
                $cantidad = $r["stock"] * $r["cantidad"];
            }
            if(array_key_exists($r["nombre"], $despensa)){
                $cantidad += $despensa[$r["nombre"]];

            }
            $despensa[$r["nombre"]] = $cantidad;
        }
        return $despensa;
    }

    public function actualizarIngrediente(int $ingredienteID, int $stock, int $cantidad, $fecha_insercion, int $id): bool{

       $fecha = DateTime::createFromFormat('d-m-Y', $fecha_insercion);
        $f1 = $fecha->format('Y-m-d');

        $res = $this->query("UPDATE despensa 
        SET ingredienteID = ?, stock = ?, cantidad = ?, fecha_insercion = ?
        WHERE despensaID = ?", [$ingredienteID, $stock, $cantidad, $f1, $id]);

        return $res->rowCount() > 0;

    }

    public function getStringIngredientes(int $id): ?string{
        $ingredientes = "";

        $res = $this->query("SELECT ingredienteID, nombre FROM ingredientes");

        foreach($res as $r){
            if($r["ingredienteID"] == $id){
                $option = "<option value='" . $r["ingredienteID"] . "' selected>" . $r["nombre"] . "</option>";

            }else{
                $option = "<option value='" . $r["ingredienteID"] . "'>" . $r["nombre"] . "</option>";

            }
            $ingredientes .= $option;
        }
        return $ingredientes;
    }

    public function filtrarDespensa(int $userId, string $filtro, string $orden){
        
        $columnasPermitidas = ['nombre', 'stock', 'cantidad', 'fecha_insercion'];
        $ordenesPermitidos  = ['ASC', 'DESC'];

        $orderBy  = in_array($filtro, $columnasPermitidas) ? $filtro : 'nombre';
        $orderDir = in_array(strtoupper($orden), $ordenesPermitidos) ? strtoupper($orden) : 'ASC';

        $tabla = $orderBy === 'nombre' ? 'ig' : 'ds';

        $sql = "SELECT ds.despensaID, ds.usuarioID, ds.ingredienteID, ig.nombre, ds.stock, ds.cantidad, DATE_FORMAT(fecha_insercion, '%d-%m-%Y') as fecha FROM despensa ds JOIN ingredientes ig ON ds.ingredienteID = ig.ingredienteID WHERE usuarioID = ? ORDER BY $tabla.`$orderBy` $orderDir";

        $res = $this->query(
            "SELECT ds.despensaID, ds.usuarioID, ds.ingredienteID, ig.nombre, 
                    ds.stock, ds.cantidad, DATE_FORMAT(fecha_insercion, '%d-%m-%Y') as fecha 
            FROM despensa ds 
            JOIN ingredientes ig ON ds.ingredienteID = ig.ingredienteID 
            WHERE usuarioID = ? 
            ORDER BY $tabla.`$orderBy` $orderDir",
            [$userId]
        );
        
        
        $despensa = [];
        foreach($res as $r){
            $despensa[] = [
                "despensaID" => $r["despensaID"],
                "usuarioID" => $r["usuarioID"],
                "ingredienteID" => $r["ingredienteID"],
                "nombre" => $r["nombre"],
                "stock" => $r["stock"],
                "cantidad" => $r["cantidad"],
                "fecha_insercion" => $r["fecha"]
            ];
        }
        return $despensa;
    }

    public function eliminarIngrediente(int $despensaID){
        $this->query("DELETE FROM despensa WHERE despensaID = ?", [$despensaID]);
        return true;
    }

    public function getTotalIngredientesDespensa(int $userID): int{
        $res = $this->query("SELECT COUNT(*) as total FROM despensa WHERE usuarioID = ?", [$userID]);
        return $res[0]["total"];

    }

}

?>