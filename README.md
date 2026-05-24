# NutreT

Aplicación web para generar recetas personalizadas con IA a partir de los ingredientes de tu despensa.

**Acceso en producción:** https://nutret.es

## Tecnologías
- PHP 8.2 + arquitectura MVC propia
- MySQL 8.0
- HTML + JavaScript + Tailwind CSS
- API OpenAI (GPT-5.4-mini)
- Docker + Docker Compose
- Nginx + SSL (Let's Encrypt)
- AWS EC2

## Instalación en local (requiere XAMPP)

1. Clona el repositorio
2. Copia la carpeta en `C:\xampp\htdocs\NutreT`
3. Crea el archivo `app/Core/env.inc.php` basándote en `.env.example`:
```php
<?php
$host         = 'localhost';
$userBD       = 'root';
$passBD       = '';
$database     = 'nutret';
$apiKeyOpenAI = 'tu-clave-de-openai';
?>
```
4. Importa `docker/init.sql` en phpMyAdmin como base de datos `nutret`
5. Arranca Apache y MySQL en XAMPP
6. Accede en `http://localhost/NutreT`

## Despliegue con Docker

1. Clona el repositorio en el servidor
2. Crea el archivo `.env` basándote en `.env.example` con tus credenciales
3. Ejecuta:
```bash
docker compose up -d
```

## Equipo
- Alvaro Ortiz Villarejo
- Elvis Cristian Vargas Jachacollo  
- Nerea Etxaniz Zubizarreta

IES Villaverde · DAW2 · Curso 2025-2026