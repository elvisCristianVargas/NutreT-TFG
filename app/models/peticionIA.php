<?php

require_once("app/models/prompt.php");
require_once("app/models/ingredientes.inc.php");
use HelgeSverre\Toon\Toon;


/**
 * Funcion que hace una limpieza de la codificacion de el prompt mandado a la API de IA
 * @param mixed $texto
 * @return array|string|null
 */
function limpiarUTF8(string|array $texto): string {
    if(is_array($texto)){
        $texto = implode(",", $texto);
    }
    // Método 1: Limpiar caracteres inválidos
    $texto = mb_convert_encoding($texto, 'UTF-8', 'UTF-8');
    
    // Método 2: Eliminar caracteres no UTF-8
    $texto = iconv('UTF-8', 'UTF-8//IGNORE', $texto);
    
    // Método 3: Remover caracteres de control invisibles
    $texto = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $texto);
    
    return $texto;
}

function limpiarRespuestaAI(string $respuesta): string {
    // 1. Decodificar entidades HTML si existen
    $receta_limpia = html_entity_decode($respuesta, ENT_QUOTES | ENT_XML1, 'UTF-8');
    
    // 2. Eliminar espacios en blanco innecesarios
    $receta_limpia = trim($receta_limpia);
    
    // 3. Eliminar posibles saltos de línea problemáticos al inicio
    $receta_limpia = preg_replace('/^\s+/', '', $receta_limpia);


    return $receta_limpia;

}

function generarPrompt(array $ingredientes, array $caracteristicas): string{
    global $prompt;
    $recetaRespuesta = "";

    // ✅ PASO 1: Limpiar el prompt PRIMERO
    $prompt = limpiarUTF8($prompt);
    
    // PASO 2: Reemplazar caracteres problemáticos
    $buscar  = ["\"","\"","'","'","…","→","°","–","—", "<", ">", "&lt;", "&gt;", "<br>", "<br />", "<br/>", "&lt;br&gt;", "<br />"];
    $reemplazar = ['"','"',"'", "'", "...", "->", " grados", "-", "-", "<", ">", "<", ">", "\n", "\n", "\n", "\n"];
    $prompt = str_replace($buscar, $reemplazar, $prompt);

    // ✅ PASO 3: Validar que sea UTF-8 válido
    if (!mb_check_encoding($prompt, 'UTF-8')) {
        echo "<strong>Error:</strong> El prompt contiene caracteres inválidos después de limpieza.";
        exit;
    }

    // ==== CONFIGURACIÓN ====
    $api_key = getenv('OPENAI_KEY');
    $url = "https://api.openai.com/v1/chat/completions";

    // ✅ PASO 4: Limpiar también los ingredientes y características
    $ingredientes = array_map('limpiarUTF8', $ingredientes);
    $caracteristicas = array_map('limpiarUTF8', $caracteristicas);
    $ingredientesFinales = [];
    foreach ($ingredientes as $index => $ing) {
        $ingredientesFinales[] = "$index=$ing";
    }

    // ==== DATOS DE LA PETICIÓN ====
    $data = [
        "model" => "gpt-4o-mini",
        "messages" => [
            ["role" => "system", "content" => $prompt],
            ["role" => "user", "content" => "Ingredientes: " . implode(", ", $ingredientesFinales) . "\nCaracteristicas: " . implode(", ", $caracteristicas)]
        ],
        "temperature" => 0.7
    ];

    // ✅ PASO 5: Generar JSON con flags UTF-8
    $json_payload = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
    // Verificar errores en JSON
    if ($json_payload === false) {
        echo "<strong>Error al generar JSON:</strong> " . json_last_error_msg();
        echo "<br><strong>Datos problemáticos:</strong><pre>";
        print_r($data);
        echo "</pre>";
        exit;
    }

    // ==== ENVÍO DE LA PETICIÓN ====
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json; charset=UTF-8",
        "Authorization: Bearer $api_key"
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json_payload);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // ==== PROCESAR RESPUESTA ====
    $result = json_decode($response, true);



    if (isset($result["error"])) {
        echo "<strong>Error:</strong> " . $result["error"]["message"];
        exit;
    }

    if (isset($result["choices"][0]["message"]["content"])) {
        $recetaRespuesta = nl2br(htmlspecialchars($result["choices"][0]["message"]["content"]));
    } else {
        echo "<strong>No se encontró contenido en la respuesta.</strong>";
    }
    print $recetaRespuesta . "<br><br><br><br><br>";

    $recetaRespuesta = str_replace("<br />", "", $recetaRespuesta);

    return $recetaRespuesta;
}

$hola = generarPrompt(["tomate", "pasta", "queso", "garbanzos"], ["rapida"]);
print $hola;

function leerArchivoTOON(string $contenido){
    $data = Toon::decode($contenido);

    return $data;
}



var_dump(leerArchivoTOON($hola));

?>