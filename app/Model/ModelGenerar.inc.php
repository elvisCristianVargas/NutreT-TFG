<?php

use HelgeSverre\Toon\Toon;

class ModelGenerar extends Model{

    private string $prompt;

    public function __construct(){
        parent::__construct();
        
// TODO: Mejorar el prompt para que sea mas preciso y claro, evitando ambigüedades y asegurando que el modelo entienda perfectamente cada paso del proceso de decisión y las reglas de formato. Incluir ejemplos más detallados y casos de borde para ilustrar cómo manejar situaciones complejas, como características contradictorias o ingredientes limitados.
        $this->prompt = <<<PROMPT
[ROL Y RESTRICCIONES]
Eres RecipeArchitect, un generador de recetas en formato TOON estricto.
- NO respondas con explicaciones, diálogos ni texto conversacional
- SOLO devuelve el bloque TOON
- Si hay error, devuelve: ERROR: <código> — <descripción>

[ENTRADA]
Recibirás JSON con:
  "ingredientes_disponibles": array de strings (3+ items)
  "caracteristicas": array de strings (1+ items)
  "platos_excluidos": array de strings o null

[SALIDA - FORMATO TOON EXACTO]

ESTRUCTURA DE ÁRBOL (cada línea comienza en columna exacta - contar espacios):

LÍNEA 1: "recipe:" (SIN espacios al inicio)
LÍNEA 2-15: campos principales (EXACTAMENTE 2 espacios de indentación)
  Incluyen: name, servings, difficulty, prep/cook/totalTimeMin, cuisine, course, tags
LÍNEA 16: "  ingredients[N]:" (2 espacios) donde N = cantidad exact de ingredientes
LÍNEA 17+: "    - quantity: N" (4 espacios, guion, espacio)
LÍNEA 18+: "      unit: ..." (6 espacios)
LÍNEA 19+: "      item: ..." (6 espacios)
...repetir para cada ingrediente...
LÍNEA X: "  steps[N]:" (2 espacios)
LÍNEA X+1: "    - number: 1" (4 espacios)
LÍNEA X+2: "      timeMin: ..." (6 espacios)
LÍNEA X+3: "      temp: ..." (6 espacios)
LÍNEA X+4: "      technique: ..." (6 espacios)
LÍNEA X+5: "      description: ..." (6 espacios)
...repetir para cada paso...
LÍNEA Y: "  plating[N]:" (2 espacios)
LÍNEA Y+1: "    - number: 1" (4 espacios)
LÍNEA Y+2: "      instruction: ..." (6 espacios)
...repetir para cada elemento plating...
LÍNEA Z: "  nutritionPer100g:" (2 espacios)
LÍNEA Z+1: "    calories: N" (4 espacios)
LÍNEA Z+2: "    protein: N" (4 espacios)
LÍNEA Z+3: "    carbs: N" (4 espacios)
LÍNEA Z+4: "    fat: N" (4 espacios)
LÍNEA Z+5: "    fiber: N" (4 espacios)
LÍNEA Z+6: "    sodium: N" (4 espacios)
...metadata, variations, commonMistakes, metadata con misma estructura...

[EJEMPLO CORRECTO COMPLETO]

Entrada:
{
  "ingredientes_disponibles": ["huevo", "tomate", "aceite", "sal", "harina"],
  "caracteristicas": ["rápida", "sencilla"],
  "platos_excluidos": null
}

Salida TOON (COPIAR EXACTAMENTE ESTE FORMATO):

recipe:
  name: Tortilla de Tomate y Huevo
  servings: 2
  difficulty: beginner
  prepTimeMin: 10
  cookTimeMin: 10
  totalTimeMin: 20
  cuisine: spanish
  course: main
  tags[2]:
    - rápida
    - sencilla
  ingredients[4]:
    - quantity: 4
      unit: unidad
      item: huevo batido
    - quantity: 2
      unit: unidad
      item: tomate troceado
    - quantity: 1
      unit: cucharada
      item: aceite
    - quantity: 1
      unit: pizca
      item: sal
  steps[3]:
    - number: 1
      timeMin: 3
      temp: high
      technique: saltear
      description: En una sartén caliente con aceite, añade el tomate y cocina hasta que se ablande y suelte su jugo (aroma dulce característico).
    - number: 2
      timeMin: 2
      temp: medium
      technique: mezcla
      description: Vierte los huevos batidos sobre el tomate y revuelve suavemente hasta que comiencen a cuajar (cambio de textura de líquido a semi-sólido).
    - number: 3
      timeMin: 5
      temp: medium
      technique: cocción
      description: Reduce el fuego y deja que termine de cuajar hasta que los bordes estén dorados (color marrón claro, centro ligeramente jugoso al pinchar).
  plating[1]:
    - number: 1
      instruction: Sirve la tortilla directamente en un plato tibio y decora con rodajas de tomate fresco.
  nutritionPer100g:
    calories: 150
    protein: 10
    carbs: 5
    fat: 8
    fiber: 1
    sodium: 150
  variations[2]:
    - name: Tortilla de Espinacas
      modification: Sustituye el tomate por espinacas frescas salteadas, añade queso parmesano opcional.
    - name: Tortilla con Cebolla
      modification: Sofríe cebolla fina antes de añadir el tomate para sabor más suave.
  commonMistakes[2]:
    - number: 1
      mistake: No calentar suficientemente la sartén; si no está caliente, la tortilla quedará blanda y apelmazada.
    - number: 2
      mistake: Cocinar demasiado tiempo; retira del fuego cuando el centro aún esté ligeramente jugoso para preservar textura cremosa.
  metadata:
    selected_ingredients[4]:
      - huevo batido
      - tomate troceado
      - aceite
      - sal
    discarded_ingredients[0]:
    discarded_reasons[0]:
    used_characteristics[2]:
      - rápida
      - sencilla
    reasoning_summary: Receta rápida y sencilla que aprovecha ingredientes básicos para una tortilla sabrosa, accesible para principiantes.

[REGLAS ABSOLUTAS]
1. INDENTACIÓN: Siempre 2 espacios. Nunca tabs.
2. ESTRUCTURA: recipe: -> campos (2sp) -> arrays (2sp) -> elementos (4sp) -> sub-campos (6sp)
3. SALTOS DE LÍNEA: UN salto entre cada propiedad de primer nivel (recipe, ingredients, steps, etc.)
4. CONTEOS: ingredients[N], steps[N], etc. — N debe ser número EXACTO de elementos listados
5. SANS COMILLAS: Claves sin comillas (name:, no "name":). Valores string sin comillas salvo necesidad.
6. VALIDACIÓN: totalTimeMin = prepTimeMin + cookTimeMin. Invariante obligatoria.
7. RESPUESTA ÚNICA: Solo el bloque TOON. Nada más.
PROMPT;
    }

    public function limpiarUTF8(string|array $texto): string {
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

    public function limpiarRespuestaAI(string $respuesta): string {
        // 1. Decodificar entidades HTML si existen
        $receta_limpia = html_entity_decode($respuesta, ENT_QUOTES | ENT_XML1, 'UTF-8');
        
        // 2. Eliminar espacios en blanco innecesarios
        $receta_limpia = trim($receta_limpia);
        
        // 3. Eliminar posibles saltos de línea problemáticos al inicio
        $receta_limpia = preg_replace('/^\s+/', '', $receta_limpia);


        return $receta_limpia;

    }

    public function generarPrompt(array $ingredientes, array $caracteristicas = ["saludable"], $platosExcluidos = []): string|array {
        global $apiKeyOpenAI;
        $recetaRespuesta = "";

        // PASO 1: Limpiar el prompt PRIMERO
        $prompt = $this->limpiarUTF8($this->prompt);

        // PASO 2: Reemplazar caracteres problemáticos
        $buscar  = ["\"","\"","'","'","…","→","°","–","—", "<", ">", "&lt;", "&gt;", "<br>", "<br />", "<br/>", "&lt;br&gt;", "<br />"];
        $reemplazar = ['"','"',"'", "'", "...", "->", " grados", "-", "-", "<", ">", "<", ">", "\n", "\n", "\n", "\n"];
        $prompt = str_replace($buscar, $reemplazar, $prompt);

        // PASO 3: Validar que sea UTF-8 válido
        if (!mb_check_encoding($prompt, 'UTF-8')) {
            return ["error" => "El prompt contiene caracteres inválidos después de limpieza."];
        }

        // ==== CONFIGURACIÓN ====
        $api_key = $apiKeyOpenAI;
        $url = "https://api.openai.com/v1/chat/completions";

        // PASO 4: Extraer solo nombres de ingredientes
        $ingredientesLimpios = [];
        foreach ($ingredientes as $ing) {
            if (is_array($ing) && isset($ing['nombre'])) {
                $ingredientesLimpios[] = $this->limpiarUTF8($ing['nombre']);
            } else if (is_string($ing)) {
                $ingredientesLimpios[] = $this->limpiarUTF8($ing);
            }
        }

        // Limpiar características
        $todasNull = true;
        $caracteristicasLimpias = [];
        foreach ($caracteristicas as $carac) {
            if(!is_null($carac)){
                $todasNull = false;
                $caracteristicasLimpias[] = $carac;
            }
        }
        if(is_null($caracteristicas) || !is_array($caracteristicas) || empty($caracteristicas) || $todasNull){ 
            $caracteristicas = ["saludable"]; // Valor por defecto si no es un array válido
        }

        if(count($caracteristicasLimpias) > 0){
            $caracteristicas = $caracteristicasLimpias;

        }

        $caracteristicas = array_map([$this, 'limpiarUTF8'], $caracteristicas);
        unset($todasNull);

        // Asegurar que platos_excluidos siempre sea un array
        if (is_null($platosExcluidos) || !is_array($platosExcluidos)) {
            $platosExcluidos = null;
        } else {
            $platosExcluidos = array_map([$this, 'limpiarUTF8'], $platosExcluidos);
        }

        $userInput = [
            "ingredientes_disponibles" => $ingredientesLimpios,
            "caracteristicas" => $caracteristicas,
            "platos_excluidos" => $platosExcluidos
        ];

        // ==== DATOS DE LA PETICIÓN ====
        $data = [
            "model" => "gpt-4o-mini",
            "messages" => [
                ["role" => "system", "content" => $prompt],
                ["role" => "user", "content" => json_encode($userInput, JSON_UNESCAPED_UNICODE)]
            ],
            "temperature" => 0.7
        ];

        // PASO 5: Generar JSON con flags UTF-8
        $json_payload = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        if ($json_payload === false) {
            return ["error" => "Error al generar JSON: " . json_last_error_msg(), "datos" => $data];
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
            return ["error" => $result["error"]["message"]];
        }

        if (isset($result["choices"][0]["message"]["content"])) {
            // ❌ Eliminado: nl2br y htmlspecialchars que añadían <br /> al string
            // ❌ Eliminado: print $recetaRespuesta
            $recetaRespuesta = $result["choices"][0]["message"]["content"];
        } else {
            return ["error" => "No se encontró contenido en la respuesta.", "respuesta_cruda" => $result];
        }

        $recetaRespuesta = str_replace("<br />", "", $recetaRespuesta);
        if (isset($result["choices"][0]["message"]["content"])) {
            $recetaRespuesta = $result["choices"][0]["message"]["content"]; // ← sin nl2br, sin htmlspecialchars, sin str_replace
        }

        return $recetaRespuesta;
    }

    public function leerArchivoTOON(string $contenido){
        $data = Toon::decode($contenido, \HelgeSverre\Toon\DecodeOptions::lenient());

        return $data;
    }

    public function getPeticionesRestantes(int $idUsuario): int{
        $res = $this->query("SELECT peticionesRestantes FROM usuarios WHERE usuarioID = ?", [$idUsuario]);

        return $res[0]["peticionesRestantes"];
    }

    public function restarPeticion(int $userId): void {
        $this->query("UPDATE usuarios SET peticionesRestantes = peticionesRestantes - 1 WHERE usuarioID = ?", [$userId]);
        
    }

    public function obtenerCategoriaReceta(array $receta){
        $categoria = $receta["course"] ?? "main";
        return $categoria;
    }

    public function sumarPeticion(int $userId): void{
        $this->query("UPDATE usuarios SET peticionesRestantes = peticionesRestantes + 1 WHERE usuarioID = ?", [$userId]);
    }

}

?>