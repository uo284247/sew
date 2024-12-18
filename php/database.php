<?php
    class Database {
        private $server = "localhost";
        private $user = "DBUSER2024";
        private $pass = "DBPSWD2024"; 
        public $dbname = "formula1";  
        public $conn;

        public function createDatabase() {
            $this->conn = new mysqli($this->server, $this->user, $this->pass);
        
            if ($this->conn->connect_error) {
                die("Conexión fallida: " . $this->conn->connect_error);
            }
        
            $this->conn->query("CREATE DATABASE IF NOT EXISTS {$this->dbname}");
        }

        public function connect() {
            $this->conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        
            if ($this->conn->connect_error) {
                die("Conexión fallida: " . $this->conn->connect_error);
            }
            $this->conn->options(MYSQLI_OPT_LOCAL_INFILE, true);
            
            return $this->conn;
        }

        public function databaseExists($conn) {
            $query = "SHOW TABLES";
            $result = $this->conn->query($query);
            
            if ($result && $result->num_rows > 0) {
                return true;
            } else {
                return false;
            } 
        }
    }

    $database = new Database();
    $database->createDatabase();

    $conn = $database->connect();
?>
