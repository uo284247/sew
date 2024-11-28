"use strict";


class Viajes {
    constructor(){
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this),  this.verErrores.bind(this));
    }

    getPosicion(posicion){
        this.longitud         = posicion.coords.longitude; 
        this.latitud          = posicion.coords.latitude;  
        this.precision        = posicion.coords.accuracy;
        this.altitud          = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.rumbo            = posicion.coords.heading;
        this.velocidad        = posicion.coords.speed;       
    }
    verErrores(error){
        const section = document.querySelector("section");
        const p = document.createElement("p");
        switch(error.code) {
        case error.PERMISSION_DENIED:
            p.textContent = "El usuario no permite la petición de geolocalización";
            section.appendChild(p);
            break;
        case error.POSITION_UNAVAILABLE:
            p.textContent = "Información de geolocalización no disponible";
            section.appendChild(p);
            break;
        case error.TIMEOUT:
            p.textContent = "La petición de geolocalización ha caducado";
            section.appendChild(p);
            break;
        case error.UNKNOWN_ERROR:
            p.textContent = "Se ha producido un error desconocido";
            section.appendChild(p);
            break;
        }
    }
    getMapaEstaticoGoogle(){
        
        var ubicacion=$("input:first");
        
        var apiKey = "&key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU";
        var url = "https://maps.googleapis.com/maps/api/staticmap?";
        var centro = "center=" + this.latitud + "," + this.longitud;
        var zoom ="&zoom=15";
        var tamaño= "&size=800x600";
        var marcador = "&markers=color:red%7Clabel:S%7C" + this.latitud + "," + this.longitud;
        var sensor = "&sensor=false"; 
        
        this.imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey;
        ubicacion.after("<img src='"+this.imagenMapa+"' alt='mapa estático google' />");
        ubicacion.remove();
    }
    
    mapaDinamico(){
        var boton=$("input:last");
        var centro = {lat: this.latitud, lng: this.longitud };
        const div = document.createElement("div");
        const section = document.querySelector("section");
        section.appendChild(div)
        var mapaGeoposicionado = new google.maps.Map(div,{
            zoom: 8,
            center:centro,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        new google.maps.Marker({
            position: centro,
            map: mapaGeoposicionado,
            title: "tu ubicación actual"
        });
        boton.remove();
    }

   
}
const viajes = new Viajes();
