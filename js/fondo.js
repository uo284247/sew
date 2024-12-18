class Fondo {
    constructor(pais, capital, circuito) {
        this.pais = pais;
        this.capital = capital;
        this.circuito = circuito;
    }

    obtenerImagenDeCircuito() {
        const flickrAPI = "https://api.flickr.com/services/rest/";
        const apiKey = 'f7324900daa881115fe5804333beb18e'; 
        const searchQuery = `${this.circuito} F1`; 
        const parametros = {
            method: "flickr.photos.search",
            api_key: apiKey,
            tags: searchQuery, 
            tagmode: "any", 
            format: "json", 
            nojsoncallback: 1 
        };

        $.getJSON(flickrAPI, parametros)
        .done((data) => {
            if (data.photos.photo.length > 0) {
                const photo = data.photos.photo[5]; 
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
