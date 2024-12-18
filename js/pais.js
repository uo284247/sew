  
"use strict"; //comprobación estricta de tipos
        
class Pais {

	constructor (nombre, capital, poblacion){
        this.nombre = nombre;
        this.capital = capital;
        this.poblacion = poblacion;
        this.circuito = "";                  
        this.formaGobierno = "";              
        this.coordenadasMeta = { lat: 0, lng: 0 };
        this.religion = ""; 
    }

    obtenerMeteorologia(){
        const appid = "1bdb7f8caddee79141b4dcd3cadf7bdc";  
        const lat = 45.6189736862258;  
        const lon = 9.281186643752484;  
        const lang = "es";  
        const units = "metric";  
    
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&lang=${lang}&appid=${appid}&mode=xml`,
            method: "GET",
            dataType: "xml",
            success: function(response) {
                const forecastData = [];
                
                $(response).find("forecast > time").each(function() {
                    const time = $(this);
                    const dateTime = time.attr("from"); 
                    const date = dateTime.split("T")[0];
                    const tempMin = parseFloat(time.find("temperature").attr("min"));
                    const tempMax = parseFloat(time.find("temperature").attr("max"));
                    const humidity = time.find("humidity").attr("value");
                    const timeOfDay = dateTime.split("T")[1].split(":")[0];;
                    const weatherIcon = time.find("symbol").attr("var"); // Ícono de clima

                    const precipitation = time.find("precipitation").attr("value") || 0;
        
                    let day = forecastData.find(d => d.date === date);
                    const today = new Date().toISOString().split("T")[0];
                    
                    if (day == null){
                        let precipitationValue = parseFloat(precipitation);
                        day = { date, tempMin, tempMax, humidity, precipitationValue, weatherIcon:'' };
                        forecastData.push(day);
                    } else{
                        day.tempMin = Math.min(day.tempMin, tempMin);
                        day.tempMax = Math.max(day.tempMax, tempMax);
                        day.precipitationValue += parseFloat(precipitation);
                    }
                    if (date === today) {
                        if (!day.weatherIcon && timeOfDay >= "12") {
                        day.weatherIcon = weatherIcon; 
                    }
                    } else if (timeOfDay === "12") {
                        day.weatherIcon = weatherIcon;
                    }
                    
                });

                forecastData.slice(0, 5).forEach(day => {
                    // Crea el elemento <article>
                    const article = document.createElement('article');
                
                    // Crea el encabezado <h3> y lo añade al artículo
                    const h3 = document.createElement('h3');
                    h3.textContent = day.date;
                    article.appendChild(h3);
                
                    // Crea la imagen <img> y la añade al artículo
                    const img = document.createElement('img');
                    img.src = `https://openweathermap.org/img/wn/${day.weatherIcon}.png`;
                    img.alt = "Icono del clima";
                    article.appendChild(img);
                
                    // Crea el párrafo para la temperatura máxima y lo añade al artículo
                    const tempMax = document.createElement('p');
                    tempMax.textContent = `Temp. Máxima: ${day.tempMax} C`;
                    article.appendChild(tempMax);
                
                    // Crea el párrafo para la temperatura mínima y lo añade al artículo
                    const tempMin = document.createElement('p');
                    tempMin.textContent = `Temp. Mínima: ${day.tempMin} C`;
                    article.appendChild(tempMin);
                
                    // Crea el párrafo para la humedad y lo añade al artículo
                    const humidity = document.createElement('p');
                    humidity.textContent = `Humedad: ${day.humidity}%`;
                    article.appendChild(humidity);
                
                    // Crea el párrafo para la precipitación y lo añade al artículo
                    const precipitation = document.createElement('p');
                    precipitation.textContent = `Precipitación: ${Number(day.precipitationValue.toFixed(2))} mm`;
                    article.appendChild(precipitation);
                
                    // Añade el artículo al contenedor del DOM
                    document.querySelector("main section").appendChild(article);
                });
                
            },
            error: function(xhr, status, error) {
                console.error("Error en la llamada AJAX:", status, error);
            }
        });
    }
    

    rellenaAtributos(circuito, gobierno, coordenadasMeta, religion){
        this.circuito = circuito;
        this.gobierno = gobierno;
        this.coordenadasMeta = coordenadasMeta;
        this.religion = religion;
    }

    getNombre(){
        return this.nombre;
    }

    getCapital(){
        return this.capital;
    }
    

    getLista(){
        var output = "<ul>";
        output += "<li>Nombre del circuito: " + this.circuito + "</li>";
        output += "<li>Población: " + this.poblacion + "</li>";
        output += "<li>Forma de gobierno: " + this.gobierno + "</li>";
        output += "<li>Religión: " + this.religion + "</li>";
        output += "</ul>";
        return output
    }

    writeDocument(){ 
        document.write("<h3> Coordenadas </h3> <ul> <li> Longitud: " + this.coordenadasMeta.lng + " </li> <li>Latitud: " + this.coordenadasMeta.lat + "</li></ul>")
    }
}

var pais = new Pais("Italia", "Roma", 58860000)
		
pais.rellenaAtributos(
    "Circuito de Monza",              
    "República parlamentaria",         
    { 
        lat: 45.6189736862258,
        lng: 9.281186643752484
    },                                               
    "Catolicismo"                     
);
		
document.write("<h3>Información del País</h3>");
document.write("<p><strong>Nombre del País:</strong> " + pais.nombre + "</p>");
document.write("<p><strong>Capital:</strong> " + pais.capital + "</p>");
document.write(pais.getLista());
pais.writeDocument();
document.close();
pais.obtenerMeteorologia();