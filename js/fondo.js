class Fondo {
    constructor(pais, capital, circuito) {
        this.pais = pais;
        this.capital = capital;
        this.circuito = circuito;
    }

    // Método para consultar la API de Flickr y obtener una imagen del circuito usando jQuery
    obtenerImagenDeCircuito() {
        const flickrAPI = "https://api.flickr.com/services/rest/";
        const apiKey = 'f7324900daa881115fe5804333beb18e'; // Sustituye con tu clave de API de Flickr
        const searchQuery = `${this.circuito} F1`; // Usamos los términos más específicos como "pista de F1"

        // Parámetros para la consulta a Flickr
        const parametros = {
            method: "flickr.photos.search",
            api_key: apiKey,
            tags: searchQuery, // Usamos el nombre del circuito como etiqueta
            tagmode: "any", // Cualquier etiqueta
            format: "json", // Respuesta en formato JSON
            nojsoncallback: 1 // Desactivamos el callback JSONP
        };

        $.getJSON(flickrAPI, parametros)
        .done((data) => {
            if (data.photos.photo.length > 0) {
                const photo = data.photos.photo[5]; // Tomamos la primera foto
                const imageUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
                $("body").css({
                    "background-image": `url(${imageUrl})`,
                    "position": "relative",
                    "background-size": "cover",
                    "background-repeat": "no-repeat",
                    "background-position": "center center", 
                    "background-attachment": "fixed"
                });
            } else {
                console.log("No se encontraron imágenes");
            }
        })
        
            .fail(() => {
                console.log("Error al hacer la solicitud a Flickr");
            });
    }
}

// Ejemplo de uso
const fondoEjemplo = new Fondo("Italia", "Roma", "Monza");
fondoEjemplo.obtenerImagenDeCircuito();
