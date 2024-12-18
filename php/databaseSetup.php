<?php
class DatabaseSetup {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    // Método para crear la base de datos y las tablas
    public function createDatabaseAndTables() {
        $sql = "CREATE DATABASE IF NOT EXISTS formula1";
        $this->conn->query($sql);

        $this->conn->select_db('formula1');
        
        $sql = "
            CREATE TABLE IF NOT EXISTS equipos (
                equipo_id INT PRIMARY KEY AUTO_INCREMENT,
                nombre VARCHAR(255) NOT NULL,
                pais VARCHAR(100) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS pilotos (
                piloto_id INT PRIMARY KEY AUTO_INCREMENT,
                nombre VARCHAR(100) NOT NULL,
                apellido VARCHAR(100) NOT NULL,
                fecha_nacimiento DATE NOT NULL,
                equipo_id INT NOT NULL,
                FOREIGN KEY (equipo_id) REFERENCES equipos(equipo_id)
            );

            CREATE TABLE IF NOT EXISTS circuitos (
                circuito_id INT PRIMARY KEY AUTO_INCREMENT,
                nombre VARCHAR(255) NOT NULL,
                localizacion VARCHAR(255) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS carreras (
                carrera_id INT PRIMARY KEY AUTO_INCREMENT,
                nombre VARCHAR(255) NOT NULL,
                fecha DATE NOT NULL,
                circuito_id INT NOT NULL,
                FOREIGN KEY (circuito_id) REFERENCES circuitos(circuito_id)
            );

            CREATE TABLE IF NOT EXISTS resultados (
                resultado_id INT PRIMARY KEY AUTO_INCREMENT,
                carrera_id INT NOT NULL,
                piloto_id INT NOT NULL,
                posicion INT NOT NULL,
                puntos INT NOT NULL,
                FOREIGN KEY (carrera_id) REFERENCES carreras(carrera_id),
                FOREIGN KEY (piloto_id) REFERENCES pilotos(piloto_id)
            );
        ";

        if ($this->conn->multi_query($sql)) {
            do {
                if ($result = $this->conn->store_result()) {
                    $result->free();
                }
            } while ($this->conn->next_result());

        }

        return $this->getTablas();
    }

    // Método para obtener las tablas y sus columnas
    private function getTablas() {
        $query = "SHOW TABLES";
        $result = $this->conn->query($query);
    

        $mensaje = "<h4>Tablas y Atributos de la Base de Datos creada</h4>";
        $mensaje .= "<table>";
        $mensaje .= "<tr>";
        $mensaje .= "<th scope='col' id='tabla'>Tabla</th>";
        $mensaje .= "<th scope='col' id='columnas'>Columnas</th>";
        $mensaje .= "</tr>";

        while ($table = $result->fetch_row()) {
            $tableId = htmlspecialchars($table[0]);
            $mensaje .= "<tr>";
            $mensaje .= "<th scope='row' id='$tableId'>$tableId</th>";

            $queryColumns = "DESCRIBE $table[0]";
            $columnsResult = $this->conn->query($queryColumns);

            $columnNames = [];
            while ($column = $columnsResult->fetch_assoc()) {
                $columnName = htmlspecialchars($column['Field'] . " " . $column['Type']);
                $columnNames[] = $columnName;
            }

            $columnData = implode(", ", $columnNames);
            $mensaje .= "<td headers='$tableId columnas'>" . $columnData . "</td>";
            $mensaje .= "</tr>";
        }

        $mensaje .= "</table>";
        return $mensaje;
    }
}
?>
