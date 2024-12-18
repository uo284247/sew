<?php
// Incluir las clases
require_once 'database.php';
require_once 'databaseSetup.php';
require_once 'csvImporter.php';
require_once 'csvExporter.php';

$mensaje = ''; // Variable para mensajes de estado
$mensajeImporter = '';
$mensajeExporter = '';

$db = new Database();
$conn = $db->connect();
$databaseExists = $db->databaseExists($conn);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['create_db'])) {
        $setup = new DatabaseSetup($conn);
        $mensaje = $setup->createDatabaseAndTables();
    }

    if (isset($_POST['import_csv'])) {
        $importer = new CSVImporter($conn);

        if (!$databaseExists) {
            $mensajeCSV = "¡Error! Debes crear la base de datos antes de importar datos.";
        } else {
            // Importar los archivos CSV
            if (isset($_FILES['csv_equipos'])) {
                $importer->importFromCSV($_FILES['csv_equipos']['tmp_name'], 'equipos');
            }
        
            if (isset($_FILES['csv_pilotos'])) {
                $importer->importFromCSV($_FILES['csv_pilotos']['tmp_name'], 'pilotos');
            }
        
            if (isset($_FILES['csv_circuitos'])) {
                $importer->importFromCSV($_FILES['csv_circuitos']['tmp_name'], 'circuitos');
            }
        
            if (isset($_FILES['csv_carreras'])) {
                $importer->importFromCSV($_FILES['csv_carreras']['tmp_name'], 'carreras');
            }
        
            if (isset($_FILES['csv_resultados'])) {
                $importer->importFromCSV($_FILES['csv_resultados']['tmp_name'], 'resultados');
            }
            $mensajeImporter = "Los datos se han importado con éxito.";
        }
    }

    if (isset($_POST['export_csv'])) {
        if (!$databaseExists) {
            $mensajeExporter = "No hay datos que exportar.";
        } 
        else {
            $exporter = new CSVExporter($conn);
            $exporter->exportAllToCSV('exported_drivers.csv');
        }
        
    }
}
?>

<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="author" content="Yeray Rodriguez Granda" />
    <meta name="description" content="Base de datos F1" />
    <meta name="keywords" content="Equipos, pilotos, carreras, resultados, circuitos" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Semáforo</title>
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link rel="icon" href="../multimedia/imagenes/icon.ico" />
</head>
<body>
    <header>
        <h1><a href="index.html">F1 Desktop</a></h1>
        <nav>
            <a href="../index.html">Inicio</a>
            <a href="../piloto.html">Piloto</a>
            <a href="../noticias.html">Noticias</a>
            <a href="../calendario.html">Calendario</a>
            <a href="../meteorologia.html">Meteorología</a>
            <a href="../circuito.html">Circuito</a>
            <a href="../viajes.php">Viajes</a>
            <a href="../juegos.html" class="active">Juegos</a>
        </nav>
    </header>
    <p>Estás en: <a href="../index.html">Inicio</a> >> <a href="../juegos.html">Juegos</a> >> PHP</p>
    <section>
		<h3>Menú de Juegos de F1</h3>
        <nav>
            <a href="../memoria.html">Memoria</a>
            <a href="../semaforo.php">Semáforo</a>
			<a href="../api.html">API</a>
			<a href="principal.php">PHP</a>
        </nav>
	</section>
    <section>
        <h2>Base da datos de Fórmula 1</h2>

        <h3>Creación de la base de datos</h3>
        <form method="POST">
            <button type="submit" name="create_db">Crear Base de Datos y Tablas</button>
        </form>
    
        <?php if ($mensaje) { echo "<p>$mensaje</p>"; } ?>

        <h3>Importar CSV</h3>
        <form method="POST" enctype="multipart/form-data">
            <label for="csv_equipos">CSV para los equipos:</label>
            <input type="file" name="csv_equipos" id="csv_equipos" accept=".csv" required>
            <label for="csv_pilotos">CSV para los pilotos:</label>
            <input type="file" name="csv_pilotos" id="csv_pilotos" accept=".csv" required>
            <label for="csv_circuitos">CSV para los circuitos:</label>
            <input type="file" name="csv_circuitos" id="csv_circuitos" accept=".csv" required>
            <label for="csv_carreras">CSV para las carreras:</label>
            <input type="file" name="csv_carreras" id="csv_carreras" accept=".csv" required>
            <label for="csv_resultados">CSV para los resultados:</label>
            <input type="file" name="csv_resultados" id="csv_resultados" accept=".csv" required>
            <button type="submit" name="import_csv">Importar CSV</button>
        </form>

        <?php if ($mensajeImporter) { echo "<p>$mensajeImporter</p>"; } ?>

        <h3>Exportar CSV</h3>
        <form method="POST">
            <button type="submit" name="export_csv">Exportar Datos a CSV</button>
        </form>

        <?php if ($mensajeExporter) { echo "<p>$mensajeExporter</p>"; } ?>
    </section> 
</body>
</html>
