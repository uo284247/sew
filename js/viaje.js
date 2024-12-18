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
        const section = document.querySelectorAll("section");
        const secondSection = section[1]; 
        const thirdSection = section[2];
        const p = document.createElement("p");
        const p2 = document.createElement("p");
        const h3 = secondSection.querySelector("h3");
        const h3_2 = thirdSection.querySelector("h3");
        switch(error.code) {
        case error.PERMISSION_DENIED:
            p.textContent = "El usuario no permite la petición de geolocalización";
            p2.textContent = "El usuario no permite la petición de geolocalización";
            h3.insertAdjacentElement('afterend', p);  
            h3_2.insertAdjacentElement('afterend', p2);  
            break;
        case error.POSITION_UNAVAILABLE:
            p.textContent = "Información de geolocalización no disponible";
            p2.textContent = "Información de geolocalización no disponible";
            h3.insertAdjacentElement('afterend', p);  
            h3_2.insertAdjacentElement('afterend', p2);  
            break;
        case error.TIMEOUT:
            p.textContent = "La petición de geolocalización ha caducado";
            p2.textContent = "La petición de geolocalización ha caducado";
            h3.insertAdjacentElement('afterend', p);  
            h3_2.insertAdjacentElement('afterend', p2);  
            break;
        case error.UNKNOWN_ERROR:
            p.textContent = "Se ha producido un error desconocido";
            p2.textContent = "Se ha producido un error desconocido";
            h3.insertAdjacentElement('afterend', p);  
            h3_2.insertAdjacentElement('afterend', p2);  
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
        boton.after(div)
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

    cargarCarrusel(){
        window.addEventListener('load', () => {
            this.carrusel();  
        });
    }

    carrusel() {
        const slides = document.querySelectorAll("img"); 
        const nextSlide = document.querySelector("button:nth-of-type(1)"); 
        const prevSlide = document.querySelector("button:nth-of-type(2)"); 
    
        let curSlide = 0; 
        const maxSlide = slides.length - 1; 
    
        function moveSlides() {
            slides.forEach((slide, indx) => {
                let trans = 100 * (indx - curSlide); 
                $(slide).css('transform', 'translateX(' + trans + '%)')
            });
        }
    
        nextSlide.addEventListener("click", function () {
            if (curSlide === maxSlide) {
                curSlide = 0;
            } else {
                curSlide++;
            }
            moveSlides(); 
        });
    
        prevSlide.addEventListener("click", function () {
            if (curSlide === 0) {
                curSlide = maxSlide;
            } else {
                curSlide--;
            }
        });
    
        // Llama a la función para mover las imágenes y mostrar la primera correctamente
        moveSlides();
    }

   
}
const viajes = new Viajes();
viajes.cargarCarrusel();
