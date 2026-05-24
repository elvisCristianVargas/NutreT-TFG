-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-05-2026 a las 16:19:24
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `nutret`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `despensa`
--

CREATE TABLE `despensa` (
  `despensaID` int(11) NOT NULL,
  `usuarioID` int(11) NOT NULL,
  `ingredienteID` int(11) NOT NULL,
  `stock` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `fecha_Insercion` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `despensa`
--

INSERT INTO `despensa` (`despensaID`, `usuarioID`, `ingredienteID`, `stock`, `cantidad`, `fecha_Insercion`) VALUES
(2, 1, 1, 4, 1005, '2026-03-17'),
(4, 1, 3, 2, 1000, '2026-03-31'),
(5, 1, 4, 1, 1000, '2026-03-31'),
(6, 1, 2, 1, 12, '2026-03-31'),
(7, 1, 7, 1, 6, '2026-03-31'),
(8, 1, 8, 5, 500, '2026-04-02'),
(9, 1, 9, 3, 200, '2026-04-02'),
(10, 1, 10, 2, 100, '2026-04-02'),
(11, 1, 11, 4, 1000, '2026-04-02'),
(12, 1, 12, 3, 500, '2026-04-02'),
(13, 1, 13, 2, 300, '2026-04-02'),
(14, 1, 14, 2, 250, '2026-04-02'),
(15, 1, 15, 1, 400, '2026-04-02'),
(16, 1, 16, 2, 250, '2026-04-02'),
(17, 1, 17, 2, 1000, '2026-04-02'),
(18, 1, 18, 2, 500, '2026-04-02'),
(19, 1, 19, 1, 200, '2026-04-02'),
(20, 1, 20, 1, 600, '2026-04-02'),
(21, 1, 21, 3, 400, '2026-04-02'),
(22, 1, 22, 3, 1000, '2026-04-02'),
(23, 1, 23, 4, 500, '2026-04-02'),
(24, 1, 24, 2, 2, '2026-04-02'),
(25, 1, 25, 5, 5, '2026-04-02'),
(26, 1, 26, 4, 4, '2026-04-02'),
(27, 1, 27, 3, 6, '2026-04-02'),
(28, 1, 28, 2, 300, '2026-04-02'),
(29, 1, 29, 3, 3, '2026-04-02'),
(30, 1, 30, 1, 50, '2026-04-02'),
(31, 1, 31, 1, 30, '2026-04-02'),
(32, 1, 32, 1, 25, '2026-04-02'),
(33, 1, 33, 1, 250, '2026-04-02'),
(34, 1, 34, 2, 500, '2026-04-02'),
(35, 1, 35, 1, 500, '2026-04-02'),
(36, 1, 36, 2, 300, '2026-04-02'),
(37, 1, 37, 3, 500, '2026-04-02'),
(38, 1, 38, 2, 500, '2026-04-02'),
(39, 1, 39, 2, 500, '2026-04-02'),
(40, 1, 40, 2, 800, '2026-04-02'),
(41, 1, 41, 1, 600, '2026-04-02'),
(42, 1, 42, 1, 400, '2026-04-02'),
(43, 1, 43, 1, 500, '2026-04-02'),
(44, 1, 44, 1, 300, '2026-04-02'),
(45, 1, 45, 3, 3, '2026-04-02'),
(46, 1, 46, 2, 2, '2026-04-02'),
(47, 1, 47, 2, 2, '2026-04-02'),
(48, 1, 48, 1, 400, '2026-04-02'),
(49, 1, 49, 1, 300, '2026-04-02'),
(50, 1, 50, 2, 2, '2026-04-02'),
(51, 1, 51, 2, 400, '2026-04-02'),
(52, 1, 52, 3, 400, '2026-04-02'),
(53, 1, 53, 1, 300, '2026-04-02'),
(54, 1, 54, 2, 500, '2026-04-02'),
(55, 1, 55, 3, 500, '2026-04-02'),
(56, 1, 56, 1, 500, '2026-04-02'),
(57, 1, 57, 1, 200, '2026-04-02'),
(58, 1, 58, 1, 200, '2026-04-02'),
(59, 1, 59, 1, 250, '2026-04-02'),
(60, 1, 60, 1, 100, '2026-04-02'),
(61, 1, 61, 2, 250, '2026-04-02'),
(62, 1, 62, 2, 50, '2026-04-02'),
(63, 1, 63, 2, 2000, '2026-04-02'),
(64, 1, 64, 2, 1000, '2026-04-02'),
(65, 1, 65, 3, 20, '2026-04-02'),
(66, 1, 66, 3, 1000, '2026-04-02'),
(67, 1, 67, 2, 400, '2026-04-02'),
(68, 1, 68, 1, 250, '2026-04-02'),
(69, 1, 69, 1, 20, '2026-04-02'),
(70, 1, 70, 1, 50, '2026-04-02'),
(71, 1, 5, 4, 1000, '2026-04-02'),
(72, 1, 10, 1, 12, '2026-04-12'),
(73, 1, 2, 3, 24, '2026-04-12'),
(74, 1, 44, 1, 500, '2026-04-12'),
(75, 1, 65, 1, 12, '2026-04-14'),
(76, 1, 47, 2, 3, '2026-04-21'),
(77, 8, 9, 1, 1, '2026-04-22'),
(78, 8, 41, 1, 500, '2026-04-22'),
(79, 8, 52, 1, 100, '2026-04-22'),
(80, 8, 67, 1, 100, '2026-04-22'),
(81, 8, 5, 1, 1, '2026-04-22'),
(82, 1, 6, 2, 1000, '2026-04-23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `es_favorito`
--

CREATE TABLE `es_favorito` (
  `usuarioID` int(11) NOT NULL,
  `recetaID` int(11) NOT NULL,
  `calificacion` double DEFAULT NULL,
  `comentario` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `es_favorito`
--

INSERT INTO `es_favorito` (`usuarioID`, `recetaID`, `calificacion`, `comentario`) VALUES
(1, 11, 5, 'POllitooooo'),
(1, 100, 4, ''),
(1, 101, 3, 'No me gustÃ³'),
(1, 102, 3, 'La mejor ensalada de el mundo'),
(1, 131, 5, 'Me encanta el pollo'),
(1, 132, 4, ''),
(1, 133, 4, ''),
(2, 1, 4, 'Ideal para la mañana'),
(2, 6, 4, 'Buen snack'),
(3, 3, 5, 'Clásica y deliciosa'),
(8, 130, 5, 'Mola');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingredientes`
--

CREATE TABLE `ingredientes` (
  `ingredienteID` int(11) NOT NULL,
  `nombre` varchar(32) NOT NULL,
  `categoria` enum('principal','complemento','especia') DEFAULT NULL,
  `medicion` varchar(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `ingredientes`
--

INSERT INTO `ingredientes` (`ingredienteID`, `nombre`, `categoria`, `medicion`) VALUES
(1, 'Harina', 'principal', 'g'),
(2, 'Huevo', 'principal', 'u'),
(3, 'Leche', 'complemento', 'ml'),
(4, 'Sal', 'especia', 'g'),
(5, 'Aceite', 'complemento', 'ml'),
(6, 'Pollo', 'principal', 'g'),
(7, 'Tomate', 'complemento', 'u'),
(8, 'Lechuga', 'complemento', 'g'),
(9, 'Cebolla', 'complemento', 'g'),
(10, 'Ajo', 'complemento', 'g'),
(11, 'Papas', 'complemento', 'g'),
(12, 'Zanahoria', 'complemento', 'g'),
(13, 'Brócoli', 'complemento', 'g'),
(14, 'Espinaca', 'complemento', 'g'),
(15, 'Queso', 'complemento', 'g'),
(16, 'Mantequilla', 'complemento', 'g'),
(17, 'Yogur', 'complemento', 'ml'),
(18, 'Jamón', 'principal', 'g'),
(19, 'Atún', 'principal', 'g'),
(20, 'Salmón', 'principal', 'g'),
(21, 'Pechuga de pavo', 'principal', 'g'),
(22, 'Arroz', 'principal', 'g'),
(23, 'Pasta', 'principal', 'g'),
(24, 'Pan', 'principal', 'u'),
(25, 'Manzana', 'complemento', 'u'),
(26, 'Plátano', 'complemento', 'u'),
(27, 'Naranja', 'complemento', 'u'),
(28, 'Fresa', 'complemento', 'g'),
(29, 'Limón', 'complemento', 'u'),
(30, 'Pimienta', 'especia', 'g'),
(31, 'Orégano', 'especia', 'g'),
(32, 'Tomillo', 'especia', 'g'),
(33, 'Mostaza', 'complemento', 'ml'),
(34, 'Vinagre', 'complemento', 'ml'),
(35, 'Azúcar', 'complemento', 'g'),
(36, 'Tofu', 'principal', 'g'),
(37, 'Lentejas', 'principal', 'g'),
(38, 'Garbanzos', 'principal', 'g'),
(39, 'Frijoles', 'principal', 'g'),
(40, 'Carne de res', 'principal', 'g'),
(41, 'Cerdo', 'principal', 'g'),
(42, 'Macarela', 'principal', 'g'),
(43, 'Mejillones', 'principal', 'g'),
(44, 'Camarones', 'principal', 'g'),
(45, 'Pimiento rojo', 'complemento', 'u'),
(46, 'Pimiento verde', 'complemento', 'u'),
(47, 'Pepino', 'complemento', 'u'),
(48, 'Coliflor', 'complemento', 'g'),
(49, 'Berenjena', 'complemento', 'g'),
(50, 'Calabacín', 'complemento', 'u'),
(51, 'Puerro', 'complemento', 'u'),
(52, 'Champiñón', 'complemento', 'g'),
(53, 'Remolacha', 'complemento', 'g'),
(54, 'Maíz', 'complemento', 'g'),
(55, 'Avena', 'principal', 'g'),
(56, 'Miel', 'complemento', 'ml'),
(57, 'Almendras', 'complemento', 'g'),
(58, 'Nueces', 'complemento', 'g'),
(59, 'Cacahuetes', 'complemento', 'g'),
(60, 'Chocolate', 'complemento', 'g'),
(61, 'Café', 'complemento', 'g'),
(62, 'Té', 'complemento', 'g'),
(63, 'Agua', 'complemento', 'ml'),
(64, 'Leche desnatada', 'complemento', 'ml'),
(65, 'Huevo de codorniz', 'principal', 'u'),
(66, 'Caldo de pollo', 'complemento', 'ml'),
(67, 'Tomate triturado', 'complemento', 'g'),
(68, 'Soja', 'complemento', 'ml'),
(69, 'Wasabi', 'especia', 'g'),
(70, 'Jengibre', 'especia', 'g');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recetas`
--

CREATE TABLE `recetas` (
  `recetaID` int(11) NOT NULL,
  `usuarioID` int(11) NOT NULL,
  `nombre` varchar(64) NOT NULL,
  `ruta_archivo` varchar(1024) NOT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `imagen` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `recetas`
--

INSERT INTO `recetas` (`recetaID`, `usuarioID`, `nombre`, `ruta_archivo`, `categoria`, `imagen`) VALUES
(1, 2, 'Tostadas con palta', 'recetas/tostadas_palta.pdf', NULL, NULL),
(2, 2, 'Ensalada de pollo', 'recetas/ensalada_pollo.pdf', NULL, NULL),
(3, 2, 'Pasta bolognesa', 'recetas/pasta_bolognesa.pdf', NULL, NULL),
(4, 3, 'Yogur con frutas', 'recetas/yogur_frutas.pdf', NULL, NULL),
(5, 2, 'Sopa de verduras', 'recetas/sopa_verduras.pdf', NULL, NULL),
(6, 2, 'Barra de cereal', 'recetas/barra_cereal.pdf', NULL, NULL),
(7, 1, 'Pollo a la Plancha con Salsa de Tomate', 'receta_1_1775066511.json', NULL, 'image_1_1776520885.jpg'),
(8, 1, 'Pastel de Pollo y Tomate', 'receta_1_1775135801.json', NULL, NULL),
(9, 1, 'Tortilla de Pollo y Tomate', 'receta_1_1775136049.json', NULL, NULL),
(10, 1, 'Pollo a la Plancha con Salsa de Tomate Ligera', 'receta_1_1775136531.json', NULL, 'image_1_1776789860.jpg'),
(11, 1, 'Pollo Rebozado Ligero con Salsa de Tomate', 'receta_1_1775136543.json', NULL, 'image_1_1776862402.jpg'),
(12, 1, 'Pollo con Verduras al LimÃ³n', 'receta_1_1775143807.json', NULL, 'image_1_1776548425.jpg'),
(13, 1, 'SalmÃ³n con Verduras Salteadas y Yogur al LimÃ³n', 'receta_1_1775143829.json', NULL, 'image_1_1776531212.jpg'),
(14, 1, 'Bowl de Arroz con Tofu y Verduras', 'receta_1_1775143848.json', NULL, 'image_1_1776524060.jpg'),
(15, 1, 'Yogur con Fresas, PlÃ¡tano y Almendras', 'receta_1_1775144115.json', NULL, NULL),
(16, 1, 'SalmÃ³n al Horno con Verduras y LimÃ³n', 'receta_1_1775144150.json', NULL, NULL),
(17, 1, 'Mousse Ligero de Chocolate y Naranja', 'receta_1_1775144173.json', 'dessert', NULL),
(18, 1, 'Pollo con Verduras y Arroz al LimÃ³n', 'receta_1_1775144252.json', NULL, 'image_1_1776520958.jpg'),
(19, 1, 'Tarta Ligera de Manzana y Avena', 'receta_1_1775144261.json', NULL, NULL),
(20, 1, 'Ensalada Tibia de Pollo, Espinaca y Tomate', 'receta_1_1775151935.json', NULL, NULL),
(21, 1, 'Ensalada Tibia de Pollo, Espinaca y Manzana', 'receta_1_1775152238.json', NULL, NULL),
(22, 1, 'Salteado Avanzado de Pollo, BrÃ³coli y Jengibre con Arroz', 'receta_1_1775152248.json', NULL, NULL),
(23, 1, 'Pastel salado de pollo y verduras con toque de queso', 'receta_1_1775152300.json', NULL, NULL),
(24, 1, 'Sin tÃ­tulo', 'receta_1_1775165646.json', NULL, NULL),
(25, 1, 'Tacos de Pollo en SartÃ©n con Lechuga y Tomate', 'receta_1_1775165697.json', NULL, NULL),
(26, 1, 'Sin tÃ­tulo', 'receta_1_1775730468.json', NULL, NULL),
(27, 1, 'Pechuga de pavo al ajo con verduras y yogur especiado', 'receta_1_1775730530.json', NULL, NULL),
(28, 1, 'Sin tÃ­tulo', 'receta_1_1775730703.json', NULL, NULL),
(29, 1, 'Tacos de Pollo y Verduras con Yogur', 'receta_1_1776012074.json', NULL, NULL),
(30, 1, 'Ensalada templada de pollo con tomate y verduras', 'receta_1_1776013160.json', NULL, NULL),
(31, 1, 'Ensalada templada de pollo con tomate y verduras', 'receta_1_1776013163.json', NULL, NULL),
(32, 1, 'Pollo en salsa cremosa de tomate con verduras', 'receta_1_1776013236.json', NULL, NULL),
(33, 1, 'Pechuga de pollo en salsa de tomate y cebolla con verduras', 'receta_1_1776013310.json', NULL, NULL),
(34, 1, 'Bowl saludable de pollo, arroz y verduras al limÃ³n', 'receta_1_1776013607.json', NULL, NULL),
(35, 1, 'Sin tÃ­tulo', 'receta_1_1776013793.json', NULL, NULL),
(36, 1, 'Sin tÃ­tulo', 'receta_1_1776013819.json', NULL, NULL),
(37, 1, 'Tacos de Pollo con Lechuga y Tomate (15-30 min)', 'receta_1_1776013842.json', NULL, NULL),
(38, 1, 'Salteado rÃ¡pido de pollo con verduras y salsa de tomate', 'receta_1_1776013872.json', NULL, NULL),
(39, 1, 'Sin tÃ­tulo', 'receta_1_1776013934.json', NULL, NULL),
(40, 1, 'Tacos de Pollo y Tomate con Lechuga', 'receta_1_1776014029.json', NULL, NULL),
(41, 1, 'Tacos de Pollo y Tomate con Lechuga', 'receta_1_1776014030.json', NULL, NULL),
(42, 1, 'Sin tÃ­tulo', 'receta_1_1776014142.json', NULL, NULL),
(43, 1, 'Sin tÃ­tulo', 'receta_1_1776014144.json', NULL, NULL),
(44, 1, 'Sin tÃ­tulo', 'receta_1_1776014164.json', NULL, NULL),
(45, 1, 'Tacos de Pollo con Lechuga y Tomate Express', 'receta_1_1776014322.json', NULL, NULL),
(46, 1, 'Tostadas de pollo, queso y tomate con vinagreta ligera', 'receta_1_1776014471.json', NULL, NULL),
(47, 1, 'Tarta Salada RÃ¡pida de Pollo, Verduras y Queso', 'receta_1_1776014633.json', NULL, NULL),
(48, 1, 'Sin tÃ­tulo', 'receta_1_1776014736.json', NULL, NULL),
(49, 1, 'Tostadas de Pollo y Tomate con Salsa Cremosa', 'receta_1_1776014891.json', NULL, NULL),
(50, 1, 'Tacos de Pollo con Tomate y Lechuga', 'receta_1_1776015013.json', NULL, NULL),
(51, 1, 'Tarta salada de pollo, verduras y queso', 'receta_1_1776015108.json', NULL, NULL),
(52, 1, 'Pasta cremosa de pollo con tomate y verduras', 'receta_1_1776015284.json', NULL, NULL),
(53, 1, 'TazÃ³n de Pollo y Verduras con Crema de Leche', 'receta_1_1776015327.json', NULL, NULL),
(54, 1, 'Pollo cremoso al ajo con verduras y toque de limÃ³n', 'receta_1_1776015374.json', NULL, NULL),
(55, 1, 'Tacos de Pollo con Lechuga y Yogur', 'receta_1_1776015435.json', NULL, NULL),
(56, 1, 'TazÃ³n cremoso de pollo con arroz y verduras', 'receta_1_1776015482.json', NULL, NULL),
(57, 1, 'Tarta salada de pollo y verduras con queso', 'receta_1_1776015482.json', NULL, NULL),
(58, 1, 'Pollo cremoso con verduras y queso', 'receta_1_1776097668.json', NULL, NULL),
(59, 1, 'Tostadas de Pollo, Huevo y Tomate con Sabor MediterrÃ¡neo', 'receta_1_1776098364.json', NULL, NULL),
(60, 1, 'Sin tÃ­tulo', 'receta_1_1776098889.json', NULL, NULL),
(61, 1, 'Sin tÃ­tulo', 'receta_1_1776098899.json', NULL, NULL),
(62, 1, 'TazÃ³n de Pollo y Verduras con Salsa de Tomate y Lechuga', 'receta_1_1776098916.json', NULL, NULL),
(63, 1, 'Tacos de Pollo con Salsa de Tomate y Lechuga', 'receta_1_1776100917.json', NULL, NULL),
(64, 1, 'Ensalada templada de pollo con verduras y vinagreta de yogur', 'receta_1_1776101133.json', NULL, NULL),
(65, 1, 'Sin tÃ­tulo', 'receta_1_1776105557.json', NULL, NULL),
(66, 1, 'Tarta salada de pollo, espinaca y queso', 'receta_1_1776105721.json', NULL, NULL),
(67, 1, 'Pasta cremosa de pollo, tomate y espinaca', 'receta_1_1776105769.json', NULL, NULL),
(68, 1, 'Sin tÃ­tulo', 'receta_1_1776105814.json', NULL, NULL),
(69, 1, 'Sin tÃ­tulo', 'receta_1_1776105820.json', NULL, NULL),
(70, 1, 'Tostadas de Pollo, Tomate y Queso', 'receta_1_1776105839.json', NULL, NULL),
(71, 1, 'Pasta cremosa de pollo, tomate y espinaca', 'receta_1_1776106171.json', NULL, NULL),
(72, 1, 'Sin tÃ­tulo', 'receta_1_1776106329.json', NULL, NULL),
(73, 1, 'Sin tÃ­tulo', 'receta_1_1776106401.json', NULL, NULL),
(74, 1, 'Sin tÃ­tulo', 'receta_1_1776106454.json', NULL, NULL),
(75, 1, 'Sin tÃ­tulo', 'receta_1_1776106698.json', NULL, NULL),
(76, 1, 'Tacos de Pollo con Tomate y Queso', 'receta_1_1776106747.json', 'side', NULL),
(77, 1, 'Sin tÃ­tulo', 'receta_1_1776106759.json', NULL, NULL),
(78, 1, 'Tacos de Pollo, Tomate y Lechuga con Salsa Cremosa', 'receta_1_1776107434.json', NULL, NULL),
(79, 1, 'Tarta salada de pollo, verduras y queso', 'receta_1_1776107737.json', NULL, NULL),
(80, 1, 'Tacos de Pollo con Tomate y Cebolla', 'receta_1_1776107815.json', 'snack', NULL),
(81, 1, 'Pasta cremosa de pollo, tomate y verduras', 'receta_1_1776107892.json', NULL, NULL),
(82, 1, 'Salteado de Pollo con Tomate y Verduras', 'receta_1_1776108057.json', NULL, NULL),
(83, 1, 'Pasta cremosa de pollo, tomate y espinaca', 'receta_1_1776108108.json', NULL, NULL),
(84, 1, 'Tacos de Pollo, Tomate y Lechuga con Salsa Cremosa', 'receta_1_1776108934.json', NULL, NULL),
(85, 1, 'Pollo a la Crema con Tomate y Verduras', 'receta_1_1776109058.json', NULL, NULL),
(86, 1, 'Pollo en Salsa Cremosa de Tomate y Leche', 'receta_1_1776109110.json', NULL, NULL),
(87, 1, 'Sin tÃ­tulo', 'receta_1_1776109261.json', NULL, NULL),
(88, 1, 'Pollo cremoso con verduras y queso', 'receta_1_1776109407.json', NULL, NULL),
(89, 1, 'Pollo cremoso al ajo y verduras con queso', 'receta_1_1776166598.json', NULL, NULL),
(90, 1, 'Tacos de Pollo con Tomate y Salsa Cremosa de Lechuga', 'receta_1_1776167174.json', NULL, NULL),
(91, 1, 'Pollo cremoso al ajo con verduras y queso', 'receta_1_1776168681.json', NULL, NULL),
(92, 1, 'Pastel salado de pollo, verduras y queso', 'receta_1_1776169090.json', NULL, NULL),
(93, 1, 'Pasta cremosa de pollo, tomate y espinaca', 'receta_1_1776169235.json', NULL, NULL),
(94, 1, 'Pastel salado de pollo, verduras y queso', 'receta_1_1776169852.json', NULL, NULL),
(95, 1, 'Tacos de Pollo y Verduras con Queso y Salsa de Tomate', 'receta_1_1776169930.json', 'starter', NULL),
(96, 1, 'Croquetas de Pollo y Queso con Salsa de Tomate', 'receta_1_1776169985.json', NULL, NULL),
(97, 1, 'Pollo cremoso con verduras y queso', 'receta_1_1776170044.json', NULL, NULL),
(98, 1, 'Tacos de Pollo con Tomate, Cebolla y Lechuga', 'receta_1_1776170135.json', 'breakfast', NULL),
(99, 1, 'Sin tÃ­tulo', 'receta_1_1776170218.json', NULL, NULL),
(100, 1, 'Tostadas de Pollo al Tomate con Lechuga y Huevo', 'receta_1_1776170785.json', NULL, 'image_1_1776892010.jpg'),
(101, 1, 'Tacos de Lechuga con Pollo, Tomate y Yogur (sin lactosa)', 'receta_1_1776171508.json', NULL, NULL),
(102, 1, 'Ensalada tibia de pollo y verduras con yogur sin lactosa', 'receta_1_1776183332.json', NULL, NULL),
(103, 1, 'Tacos de Pollo con Tomate y Lechuga', 'receta_1_1776184270.json', NULL, NULL),
(104, 1, 'Pollo cremoso al ajo con tomate y verduras', 'receta_1_1776184348.json', NULL, NULL),
(105, 1, 'Pollo al Tomate con Lechuga y Yogur', 'receta_1_1776184375.json', NULL, NULL),
(106, 1, 'Sin tÃ­tulo', 'receta_1_1776184454.json', NULL, NULL),
(107, 1, 'Pastel salado de pollo, verduras y queso', 'receta_1_1776184474.json', NULL, NULL),
(108, 1, 'Sin tÃ­tulo', 'receta_1_1776185071.json', 'main', NULL),
(109, 1, 'Sin tÃ­tulo', 'receta_1_1776185098.json', 'main', NULL),
(110, 1, 'Sin tÃ­tulo', 'receta_1_1776185111.json', 'main', NULL),
(111, 1, 'Sin tÃ­tulo', 'receta_1_1776185146.json', 'main', NULL),
(112, 1, 'Sin tÃ­tulo', 'receta_1_1776185167.json', 'main', NULL),
(113, 1, 'Sin tÃ­tulo', 'receta_1_1776185190.json', 'main', NULL),
(114, 1, 'Sin tÃ­tulo', 'receta_1_1776185251.json', 'main', NULL),
(115, 1, 'Sin tÃ­tulo', 'receta_1_1776186260.json', 'main', NULL),
(116, 1, 'Sin tÃ­tulo', 'receta_1_1776186441.json', 'main', NULL),
(117, 1, 'Sin tÃ­tulo', 'receta_1_1776186628.json', NULL, NULL),
(118, 1, 'Sin tÃ­tulo', 'receta_1_1776186667.json', NULL, NULL),
(119, 1, 'Sin tÃ­tulo', 'receta_1_1776186705.json', NULL, NULL),
(120, 1, 'Ensalada Tibia de Pollo y Verduras con Aderezo de Yogur', 'receta_1_1776186825.json', 'starter', NULL),
(121, 1, 'Natillas de Vainilla con Fruta', 'receta_1_1776514593.json', 'dessert', NULL),
(122, 1, 'Flan de Chocolate y Miel', 'receta_1_1776514629.json', 'dessert', NULL),
(123, 1, 'Mousse de Chocolate y Naranja', 'receta_1_1776804214.json', 'dessert', 'image_1_1776804375.jpg'),
(124, 1, 'Pollo Salteado con Arroz y Verduras', 'receta_1_1776804639.json', 'main', NULL),
(125, 1, 'Pollo Salteado Ligero con Verduras', 'receta_1_1776805112.json', 'main', NULL),
(126, 1, 'Salteado Vegetariano de Tofu y Verduras', 'receta_1_1776878275.json', 'main', NULL),
(127, 1, 'Salteado Vegetariano de Garbanzos y Verduras', 'receta_1_1776878291.json', 'main', NULL),
(128, 1, 'Salteado Vegetariano de Lentejas y Verduras', 'receta_1_1776878311.json', 'main', NULL),
(129, 1, 'Arroz Salteado de Verduras y Huevo', 'receta_1_1776878341.json', 'main', NULL),
(130, 8, 'Cerdo con ChampiÃ±ones y Tomate', 'receta_8_1776879375.json', 'main', NULL),
(131, 1, 'Salteado Ligero de Pollo y Verduras con Arroz', 'receta_1_1776891946.json', 'main', NULL),
(132, 1, 'Ensalada Tibia de Pollo, Pepino y Tomate', 'receta_1_1776948821.json', 'main', NULL),
(133, 1, 'Ensalada Tibia de Pollo, Espinaca y Tomate', 'receta_1_1777306446.json', 'main', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `usuarioID` int(11) NOT NULL,
  `nombre_usuario` varchar(16) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `email` varchar(32) NOT NULL,
  `nombre` varchar(24) NOT NULL,
  `apellidos` varchar(32) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `peticionesRestantes` int(11) NOT NULL DEFAULT 3,
  `imagen` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`usuarioID`, `nombre_usuario`, `contrasena`, `email`, `nombre`, `apellidos`, `token`, `peticionesRestantes`, `imagen`) VALUES
(1, 'user1', '$2y$10$I.FyMmu3mhEozHhAleNileSIM7QDdowmq79fO84mBsgYBr/ranwBy', 'user1@gmail.com', 'usuario', '1', NULL, 999846, 'image_1_1776892084.jpg'),
(2, 'user2', '$2y$10$VDGXbegBJLmasiKAVcapte0yT6oi9kG3xHbPykDrkpUx8zCBX5Je.', 'user2@gmail.com', 'user', '2', NULL, 3, NULL),
(3, 'user3', '$2y$10$3AfXgIfziAGJkLGyYa8hOeqT3XSUeWIaf4ZCdEVXjwTQSwSgBs.GS', 'user3@gmail.com', 'user', '3', NULL, 3, NULL),
(4, 'user4', '$2y$10$uT4y127EXERCKnjG.ZuJz.3U5y80v2dBoix3cFcV3TVydYwdsJNRO', 'user4@gmail.com', 'user', '4', NULL, 3, NULL),
(5, 'user5', '$2y$10$m8a7tC8Jw9H.ut9.mJDi8uBe.QNvhvda3twSZKbDo2tgX9gES/2tC', 'user5@gmail.com', 'user', '5', NULL, 3, NULL),
(6, 'user6', '$2y$10$jf9Lk/fV.8jgTvAkVcrabux9dMwQ.3eh1FrpUtk5lU6AHpIabf8wy', 'user6@gmail.com', 'usuario', '6', NULL, 3, 'image_6_1776620943.jpg'),
(7, 'user7', '$2y$10$pS1G4Ku4vRwOeBJhyLcv9uIrccEEGvkb6CUVI314wGjUohlrK1dBe', 'user7@gmail.com', 'user', '7', NULL, 3, NULL),
(8, 'Vara', '$2y$10$sVpp43gxXRiCkPZXsqNdbenRdLIjD1J.taLSMikVevNCqWxkKDPDO', 'laalacenaderachel@gmail.com', 'Raquel', 'V.A.', NULL, 2, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `despensa`
--
ALTER TABLE `despensa`
  ADD PRIMARY KEY (`despensaID`),
  ADD KEY `usuario` (`usuarioID`),
  ADD KEY `ingrediente` (`ingredienteID`);

--
-- Indices de la tabla `es_favorito`
--
ALTER TABLE `es_favorito`
  ADD PRIMARY KEY (`usuarioID`,`recetaID`),
  ADD KEY `recetaID` (`recetaID`);

--
-- Indices de la tabla `ingredientes`
--
ALTER TABLE `ingredientes`
  ADD PRIMARY KEY (`ingredienteID`);

--
-- Indices de la tabla `recetas`
--
ALTER TABLE `recetas`
  ADD PRIMARY KEY (`recetaID`),
  ADD KEY `usuarioID` (`usuarioID`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`usuarioID`),
  ADD UNIQUE KEY `nombre_usuario` (`nombre_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `despensa`
--
ALTER TABLE `despensa`
  MODIFY `despensaID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT de la tabla `ingredientes`
--
ALTER TABLE `ingredientes`
  MODIFY `ingredienteID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT de la tabla `recetas`
--
ALTER TABLE `recetas`
  MODIFY `recetaID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=134;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `usuarioID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `despensa`
--
ALTER TABLE `despensa`
  ADD CONSTRAINT `ingrediente` FOREIGN KEY (`ingredienteID`) REFERENCES `ingredientes` (`ingredienteID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usuario` FOREIGN KEY (`usuarioID`) REFERENCES `usuarios` (`usuarioID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `es_favorito`
--
ALTER TABLE `es_favorito`
  ADD CONSTRAINT `es_favorito_ibfk_1` FOREIGN KEY (`usuarioID`) REFERENCES `usuarios` (`usuarioID`),
  ADD CONSTRAINT `es_favorito_ibfk_2` FOREIGN KEY (`recetaID`) REFERENCES `recetas` (`recetaID`);

--
-- Filtros para la tabla `recetas`
--
ALTER TABLE `recetas`
  ADD CONSTRAINT `recetas_ibfk_1` FOREIGN KEY (`usuarioID`) REFERENCES `usuarios` (`usuarioID`);

DELIMITER $$
--
-- Eventos
--
CREATE DEFINER=`root`@`localhost` EVENT `reiniciarPeticionesDia` ON SCHEDULE EVERY 1 DAY STARTS '2026-03-24 00:00:00' ON COMPLETION NOT PRESERVE ENABLE DO UPDATE usuarios SET peticionesRestantes = 3 WHERE usuarioID != 1$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
