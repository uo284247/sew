<?php
class CSVImporter {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function importFromCSV($filename, $tableName) {
        $filePath = $filename; 

        if (!file_exists($filePath)) {
            throw new Exception("El archivo no existe o ha sido eliminado.");
        }

        if (!$this->conn->options(MYSQLI_OPT_LOCAL_INFILE, 1)) {
            throw new Exception("LOCAL INFILE no está habilitado en MySQL.");
        }

        $filePath = str_replace("\\", "/", $filePath); 

        $query = "LOAD DATA LOCAL INFILE '$filePath' 
                  INTO TABLE $tableName
                  FIELDS TERMINATED BY ',' 
                  ENCLOSED BY '\"'
                  LINES TERMINATED BY '\n'
                  IGNORE 1 ROWS";

        $this->conn->query($query);
    }
}

?>