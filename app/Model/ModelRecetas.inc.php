<?php

class ModelRecetas extends Model {

    public function __construct(){
        parent::__construct();
    }

    public function guardarReceta(array $receta, int $idUsuario, string $nombreArchivo){
        $nombreReceta = $receta['name'] ?? ($receta['recipe']['name'] ?? 'Sin título');

        $this->query("INSERT INTO recetas (usuarioID, nombre, ruta_archivo, categoria) VALUES (?, ?, ?, ?)", [
            $idUsuario,
            $nombreReceta,
            $nombreArchivo,
            $receta['course'] ?? ($receta["recipe"]["course"] ?? null)
        ]);
    }

    public function getRecetasGeneradas(int $userID, string $urlBase, 
    //string $categoria = "main"
    ): array {
        $recetas = [];

        $res = $this->query("SELECT * FROM recetas WHERE usuarioID = ?", [$userID]);

        foreach($res as $receta){
            $recetas[] = ["id" => $receta["recetaID"],"nombre" => $receta["nombre"], "receta" => @file_get_contents("/var/www/html/storage/recipes/" . $receta["ruta_archivo"]), "imagen" => $receta["imagen"] ? $urlBase . "/storage/uploads/recipeImages/" . $receta["imagen"] : null];
        }
        return $recetas;
    }

    public function getRecetaPorId(int $recetaID, string $urlBase): ?array {
        $res = $this->query("SELECT * FROM recetas WHERE recetaID = ?", [$recetaID]);
        if(count($res) > 0){
            return ["id" => $res[0]["recetaID"], "nombre" => $res[0]["nombre"], "receta" => @file_get_contents("/var/www/html/storage/recipes/" . $res[0]["ruta_archivo"]), "imagen" => $res[0]["imagen"] ? $urlBase . "/storage/uploads/recipeImages/" . $res[0]["imagen"] : null];
        }
        return null;
    }

    public function getIdReceta(int $userID, string $nombreArchivo): ?int {
        $res = $this->query("SELECT recetaID FROM recetas WHERE usuarioID = ? AND ruta_archivo = ?", [$userID, $nombreArchivo]);
        if(count($res) > 0){
            return $res[0]["recetaID"];
        }
        return null;
    }

    public function guardarRecetaFavorita(int $idUsuario, int $idReceta, ?int $calificacion, ?string $comentario){
        $this->query("INSERT INTO es_favorito (usuarioID, recetaID, calificacion, comentario) VALUES (?, ?, ?, ?)", [
           $idUsuario,
           $idReceta,
           $calificacion,
           $comentario
        ]);
    }

    public function guardarImagenReceta(int $recetaId, string $nombreArchivo){
        $this->query("UPDATE recetas SET imagen = ? WHERE recetaID = ?", [
            $nombreArchivo,
            $recetaId
        ]);
    }

    public function getRecetasFavoritas(int $userID, string $urlBase): array {
        $recetas = [];

        $res = $this->query("SELECT r.recetaID, r.nombre, r.ruta_archivo, r.imagen, ef.calificacion, ef.comentario FROM recetas r JOIN es_favorito ef ON r.recetaID = ef.recetaID WHERE ef.usuarioID = ?", [$userID]);

        foreach($res as $receta){
            $contenido = @file_get_contents("/var/www/html/storage/recipes/" . $receta["ruta_archivo"]); if ($contenido !== false) { $recetas[] = ["id" => $receta["recetaID"], "nombre" => $receta["nombre"], "receta" => $contenido, "imagen" => $receta["imagen"] ? $urlBase . "/storage/uploads/recipeImages/" . $receta["imagen"] : null, "calificacion" => $receta["calificacion"], "comentario" => $receta["comentario"]]; }
        }
        return $recetas;

    }

    public function getFavoritoData(int $idUsuario, int $recetaID): ?array {
        $res = $this->query("SELECT calificacion, comentario FROM es_favorito WHERE usuarioID = ? AND recetaID = ?", [$idUsuario, $recetaID]);
        return count($res) > 0 ? $res[0] : null;
    }
    public function isFavourite(int $recetaID): bool {
        $res = $this->query("SELECT * FROM es_favorito WHERE recetaID = ?", [$recetaID]);
        return count($res) > 0;
    }

    public function eliminarRecetaFavorita(int $idUsuario, int $idReceta){
        $this->query("DELETE FROM es_favorito WHERE usuarioID = ? AND recetaID = ?", [
            $idUsuario,
            $idReceta
        ]);
    }

    public function getImagenReceta(int $recetaID): ?string {
        $res = $this->query("SELECT imagen FROM recetas WHERE recetaID = ?", [$recetaID]);
        if(count($res) > 0){
            return $res[0]["imagen"];
        }
        return null;

    }
}

?>