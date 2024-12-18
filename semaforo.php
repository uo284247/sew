<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    class Record {
        public $server;
        public $user;
        public $pass;
        public $dbname;
        public $conn;

        public function __construct() {
            $this->server = "localhost";
            $this->user = "DBUSER2024";
            $this->pass = "DBPSWD2024";
            $this->dbname = "records";
            $this->conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

            // Verificar si hay errores en la conexión
            if ($this->conn->connect_error) {
                die("Conexión fallida: " . $this->conn->connect_error);
            }
        }

        public function guardarDatos($nombre, $apellidos, $nivel, $tiempo) {
            $stmt = $this->conn->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("sssd", $nombre, $apellidos, $nivel, $tiempo);
            $stmt->execute();
            $stmt->close();
        }

        public function obtenerMejoresResultados($nivel) {
            $sql = "SELECT nombre, apellidos, tiempo FROM registro WHERE nivel = ? ORDER BY tiempo ASC LIMIT 10";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("s", $nivel);  
            $stmt->execute();

            $result = $stmt->get_result();
            $resultados = "<ol>";
            while ($row = $result->fetch_assoc()) {
                $resultados .= "<li>{$row['nombre']} {$row['apellidos']} - {$row['tiempo']} segundos</li>";
            }
            $resultados .= "</ol>";

            $stmt->close();

            return $resultados;
        }

        public function cerrarConexion() {
            $this->conn->close();
        }
    }

    $nombre = $_POST['nombre'] ?? '';
    $apellidos = $_POST['apellidos'] ?? '';
    $nivel = $_POST['nivel'] ?? '';
    $tiempo = $_POST['tiempo'] ?? '';

    $record = new Record();
    $record->guardarDatos($nombre, $apellidos, $nivel, $tiempo);
    $mejoresResultados = $record->obtenerMejoresResultados($nivel);

    $enviar = "<article><h3>Tabla de records para el nivel $nivel</h3>$mejoresResultados</article>";
    echo $enviar;

    $record->cerrarConexion();
    exit;
}
?>

<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="author" content="Yeray Rodriguez Granda" />
    <meta name="description" content="Juego que mide tu tiempo de reaccion" />
    <meta name="keywords" content="reaccion, semaforo, record" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Semáforo</title>
    <link rel="stylesheet" type="text/css" href="estilo/semaforo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="icon" href="../multimedia/imagenes/icon.ico" />
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
</head>
<body>
    <header>
        <h1><a href="index.html">F1 Desktop</a></h1>
        <nav>
            <a href="index.html">Inicio</a>
            <a href="piloto.html">Piloto</a>
            <a href="noticias.html">Noticias</a>
            <a href="calendario.html">Calendario</a>
            <a href="meteorologia.html">Meteorología</a>
            <a href="circuito.html">Circuito</a>
            <a href="viajes.php">Viajes</a>
            <a href="juegos.html" class="active">Juegos</a>
        </nav>
    </header>
    <p>Estás en: <a href="index.html">Inicio</a> >> <a href="juegos.html">Juegos</a> >> Semáforo</p>
    <section>
		<h3>Menú de Juegos de F1</h3>
        <nav>
            <a href="memoria.html">Memoria</a>
            <a href="semaforo.php">Semáforo</a>
			<a href="api.html">API</a>
			<a href="php/principal.php">PHP</a>
        </nav>
	</section>
    <main>
        <!-- Aquí podría estar el formulario u otros elementos -->
    </main>
    <script src="./js/semaforo.js"></script>
</body>
</html>
