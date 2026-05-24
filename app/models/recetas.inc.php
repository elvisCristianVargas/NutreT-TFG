<?php

function getTitulo(string $receta){
    if($fp = new SimpleXMLElement($receta)){
        return $fp->name;
    }
}

function getIngredientesReceta(string $receta){
    $ingredientes = [];
    if($fp = new SimpleXMLElement($receta)){
        foreach($fp->ingredients->ingredient as $ing){
            $ingredientes[] = (string)$ing;
        }
    }
    return $ingredientes;
}

function getPasosReceta(string $receta){
    $pasos = [];
    if($fp = new SimpleXMLElement($receta)){
        $c = 1;
        foreach($fp->steps->step as $step){
            $pasos[$c] = (string)$step;
            $c++;
        }
    }
    return $pasos;
}



?>