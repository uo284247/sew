<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="author" content="Yeray Rodriguez Granda" /> 
    <meta name="description" content="Información sobre los diferentes destinos turísticos en los que se desarrolla la F1" /> 
    <meta name="keywords" content="F1, Miami, Las Vegas, Reino Unido, España, India" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" /> 
    <title>Viajes</title>
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" /> 
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/viajes.css" />

    <link rel="icon" href="../multimedia/imagenes/icon.ico" />
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <script src="./js/viaje.js"></script>
    <script async="" defer="" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU&amp"></script>
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
            <a href="viajes.php" class="active">Viajes</a>
            <a href="juegos.html">Juegos</a>
        </nav>
    </header>
    <p>Estás en: <a href="index.html">Inicio</a> >> Viajes</p>
    <h2>Destinos</h2>
    <article>
        <h3>Carrusel de imagenes</h3>
        <?php
            class Carrusel {
                protected $capital;
                protected $pais;
                protected $imagenes;

                public function __construct($capital, $pais) {
                $this->capital = $capital;
                $this->pais = $pais;
                }

                public function getFotos(){
                    $api_key = 'f7324900daa881115fe5804333beb18e';
                    $tag = urlencode($this->pais . ' ' . $this->capital);
                    $perPage = 10;
                    $url = 'https://api.flickr.com/services/rest/?';
                    $url .= 'method=flickr.photos.search';
                    $url .= '&api_key=' . $api_key;
                    $url .= '&tags=' . $tag;
                    $url .= '&per_page=' . $perPage;
                    $url .= '&format=json';
                    $url .= '&nojsoncallback=1';
            

                    $respuesta = file_get_contents($url);
                    $json = json_decode($respuesta);
                    if($json==null) {
                        echo "<h3>Error en el archivo JSON recibido</h3>";
                        return;
                    }
                    foreach ($json->photos->photo as $foto) {
                        $urlFoto = "https://farm{$foto->farm}.staticflickr.com/{$foto->server}/{$foto->id}_{$foto->secret}_z.jpeg";
                        $this->imagenes[] = $urlFoto;  
                    }

                    $html = '';

                    // Crear cada slide con las imágenes
                    foreach ($this->imagenes as $index => $url) {
                        $html .= "<!-- slide " . ($index + 1) . " -->";
                        $html .= "<img src='" . $url . "' alt='Imagen " . ($index + 1) . " carousel' />";
                    }
                    $html .= "<button> &gt; </button>";
                    $html .= "<button> &lt; </button>";
                    echo $html;
                }
            
            }
            

            $carrusel = new Carrusel('Roma', 'Italia');
            $carrusel->getFotos();
        ?>
    </article>
    <section>
            <?php
                class Moneda{
                    private $local;
                    private $cambio;

                    public function __construct($local, $cambio){
                        $this->local = $local;
                        $this->cambio = $cambio;
                    }

                    public function getCambio() {
                        $api_key = 'f3b079b0ba3928220e0d5ca9';
                        $url = 'https://v6.exchangerate-api.com/v6/';
                        $url.= $api_key . '/pair/';
                        $url.= $this->cambio . '/' . $this->local;
                    
                        $respuesta = file_get_contents($url);
                    
                        if ($respuesta === FALSE) {
                            echo "<h3>Error al obtener la respuesta de la API</h3>";
                            return;
                        }
                    
                        $json = json_decode($respuesta);
                        if ($json === null || !isset($json->conversion_rate)) {
                            echo "<h3>Error en el archivo JSON recibido o tasa de cambio no disponible</h3>";
                            return;
                        }
                    
                        $conversion = $json->conversion_rate;
                    
                        $enviar = "<h3>Cambio de " . $this->cambio . " a " . $this->local . "</h3>";
                        $enviar .= "<p>El cambio de 1 " . $this->cambio . " a " . $this->local . " es: " . $conversion . "</p>";
                        echo $enviar;
                    }
                    
                }
                $moneda = new Moneda("EUR","USD");
                $moneda->getCambio();
            ?>
    </section>
    <section>
        <h3>Cargar mapa estático</h3>
        <input type="button" value="Obtener mapa estático" onclick="viajes.getMapaEstaticoGoogle()">
    </section>
    <section>
        <h3>Cargar mapa dinámico</h3>
        <input type="button" value="Obtener mapa dinámico" onclick="viajes.mapaDinamico()">
    </section>
</body>
</html>
