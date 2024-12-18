<?php
class CSVExporter {
    private $conn;
    
    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function exportAllToCSV() {
        $this->conn->set_charset("utf8");
    
        $sql = "SHOW TABLES";
        $result = $this->conn->query($sql);
    
        if ($result && $result->num_rows > 0) {
            header('Content-Type: text/csv; charset=UTF-8');
            header('Content-Disposition: attachment; filename="all_tables_export.csv"');
    
            $output = fopen('php://output', 'w');
            
            fwrite($output, "\xEF\xBB\xBF");
    
            while ($row = $result->fetch_row()) {
                $table = $row[0]; 
    
                fputcsv($output, ["--- $table ---"], ',');
    
                $sqlData = "SELECT * FROM $table";
                $dataResult = $this->conn->query($sqlData);
    
                if ($dataResult && $dataResult->num_rows > 0) {
                    $columns = $dataResult->fetch_fields();
                    $columsnNames = [];
    
                    foreach ($columns as $column) {
                        $columsnNames[] = $column->name;
                    }
                    fputcsv($output, $columsnNames, ',');  
    
                    while ($rowData = $dataResult->fetch_assoc()) {
                        foreach ($rowData as $data => $value) {
                            $rowData[$data] = str_replace(["\r", "\n"], " ", $value);
                        }
                        fputcsv($output, $rowData, ',');  
                    }
                } else {
                    fputcsv($output, ["No hay datos en esta tabla."], ',');  
                }
    
                fputcsv($output, [], ',');  
            }
    
            fclose($output);
            exit();
        } else {
            throw new Exception("No se encontraron tablas en la base de datos.");
        }
    }
    
    
  
}

?>