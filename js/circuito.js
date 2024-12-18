"use strict";


class Circuito {

    svg(files) {
        var file = files[0];
        let section = document.querySelector('section:nth-of-type(2)');
    
        // Verificar si el navegador soporta las APIs de archivos
        if (!window.File && !window.FileReader && !window.FileList && !window.Blob) {
            section.innerHTML = "<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>";
            return;
        }
    
        // Verificar si se seleccionaron archivos
        if (!files || files.length === 0) {
            section.innerHTML = "<p>Error: No se seleccionó ningún archivo.</p>";
            return;
        }
    
        // Verificar si el archivo es SVG
        if (file.type !== 'image/svg+xml') {
            section.innerHTML += `<p>Error: El archivo "${file.name}" no es un archivo SVG válido.</p>`;
            return;  
        }

        const existingSvg = section.querySelector('svg');
        if (existingSvg) {
            existingSvg.remove();
        }
    
        // Crear un FileReader para leer el archivo
        const reader = new FileReader();
        reader.onload = function (evento) {
            var svgContent = evento.target.result;
    
            // Usar DOMParser para convertir el texto SVG en un nodo DOM
            var parser = new DOMParser();
            var svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
    
            // Verificar si la conversión fue exitosa (el archivo es un SVG válido)
            if (svgDoc.documentElement.tagName === "svg") {
                let br = document.createElement('br');  
                section.append(br);
                section.append(svgDoc.documentElement);  // Insertar el SVG en la página

            } else {
                section.innerHTML += `<p>Error: El archivo "${file.name}" no es un SVG válido.</p>`;
            }
        };
    
        // Leer el archivo como texto (esto es para un archivo SVG)
        reader.readAsText(file); 
    }
    
    
    planimetria(files) {
        var file = files[0];
        const section = $('section:first');    
        if (!window.File && !window.FileReader && !window.FileList && !window.Blob) {
            section.append("<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");
            return;
        }
        
        if (!file) {
            section.append("<p>Error: No se seleccionó ningún archivo.</p>");
            return;
        }
    
        if (file.type !== 'application/vnd.google-earth.kml+xml' && !file.name.endsWith('.kml')) {
            section.append(`<p>Error: El archivo "${file.name}" no es un archivo KML válido.</p>`);
            return;
        }

        section.find('div').remove();

        const divMap = document.createElement("div");
        const sectionToAppend = document.querySelector("section:first-of-type");
        sectionToAppend.appendChild(divMap);
    
        var mapaGeoposicionado = new google.maps.Map(divMap, {
            center: new google.maps.LatLng(45.6189736862258, 9.281186643752484), 
            zoom: 14, 
            mapTypeId: 'terrain'
        });
        const reader = new FileReader();
        reader.onload = function (evento) {
            const kmlContent = evento.target.result;
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(kmlContent, 'application/xml');
    
            const coordinates = xmlDoc.getElementsByTagName('coordinates');
                
            const circuitPoints = [];
    
            for (let i = 0; i < coordinates.length; i++) {
                const coordsText = coordinates[i].textContent.trim();
                const coordsArray = coordsText.split(/\s+/).map(coord => {
                    const [longitude, latitude] = coord.split(',').map(Number);
                    return { lat: latitude, lng: longitude };
                });
                    
                circuitPoints.push(...coordsArray);
            }
    
            circuitPoints.forEach(point => {
                new google.maps.Marker({
                    position: point,
                    map: mapaGeoposicionado,
                    title: `Punto: ${point.lat}, ${point.lng}`,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 5, 
                        fillColor: "red",
                        fillOpacity: 0.6,
                        strokeColor: "white",
                        strokeWeight: 2
                    }
                });
            });
    
            const circuitPath = new google.maps.Polyline({
                path: circuitPoints,
                geodesic: true,
                strokeColor: "#FF0000", 
                strokeOpacity: 1.0,
                strokeWeight: 3
            });
    
            circuitPath.setMap(mapaGeoposicionado);
        };
        reader.readAsText(file);
    }
    
    
    
    leerArhivo(files){
        var archivo = files[0];
        if (archivo && archivo.type === "text/xml") {
            var lector = new FileReader();
            lector.onload = function (evento) {
                const xmlContent = evento.target.result;
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

                const nombre = xmlDoc.getElementsByTagName('nombre')[0].textContent;
                const longitud = xmlDoc.getElementsByTagName('longitud')[0].textContent;
                const unidadLongitud = xmlDoc.getElementsByTagName('longitud')[0].getAttribute('unidad');
                const anchura = xmlDoc.getElementsByTagName('anchura')[0].textContent;
                const unidadAnchura = xmlDoc.getElementsByTagName('anchura')[0].getAttribute('unidad');
                const fecha = xmlDoc.getElementsByTagName('fecha')[0].textContent;
                const hora = xmlDoc.getElementsByTagName('hora')[0].textContent;
                const vueltas = xmlDoc.getElementsByTagName('vueltas')[0].textContent;
                const localidad = xmlDoc.getElementsByTagName('localidad')[0].textContent;
                const pais = xmlDoc.getElementsByTagName('pais')[0].textContent;

                const referencias = Array.from(xmlDoc.getElementsByTagName('referencia')).map(ref => ref.textContent);
                const fotos = Array.from(xmlDoc.getElementsByTagName('foto')).map(foto => foto.textContent);
                const videos = Array.from(xmlDoc.getElementsByTagName('video')).map(video => video.textContent);

                const longitudCoord = xmlDoc.getElementsByTagName('longitud_coordenadas')[0].textContent;
                const latitud = xmlDoc.getElementsByTagName('latitud')[0].textContent;
                const altitud = xmlDoc.getElementsByTagName('altitud')[0].textContent;
                const unidadAltitud = xmlDoc.getElementsByTagName('altitud')[0].getAttribute('unidad');

                
                const tramos = Array.from(xmlDoc.getElementsByTagName('tramo')).map(tramo => {
                    const distancia = tramo.getElementsByTagName('distancia')[0].textContent;
                    const unidadDistancia = tramo.getElementsByTagName('distancia')[0].getAttribute('unidad');
                    const longitudCoord = tramo.getElementsByTagName('longitud_coordenadas')[0].textContent;
                    const latitud = tramo.getElementsByTagName('latitud')[0].textContent;
                    const altitud = tramo.getElementsByTagName('altitud')[0].textContent;
                    const unidadAltitud = tramo.getElementsByTagName('altitud')[0].getAttribute('unidad');
                    const sector = tramo.getElementsByTagName('sector')[0].textContent;

                    return {
                        distancia,
                        unidadDistancia,
                        longitudCoord,
                        latitud,
                        altitud,
                        unidadAltitud,
                        sector
                    };
                });

                let outputHtml = `
                    <h2>Datos del Circuito</h2>
                    <table>
                        <tr><th>Nombre</th><td>${nombre}</td></tr>
                        <tr><th>Longitud</th><td>${longitud} ${unidadLongitud}</td></tr>
                        <tr><th>Anchura</th><td>${anchura} ${unidadAnchura}</td></tr>
                        <tr><th>Fecha</th><td>${fecha}</td></tr>
                        <tr><th>Hora</th><td>${hora}</td></tr>
                        <tr><th>Vueltas</th><td>${vueltas}</td></tr>
                        <tr><th>Localidad</th><td>${localidad}</td></tr>
                        <tr><th>País</th><td>${pais}</td></tr>
                        <tr><th>Coordenadas</th><td>Latitud: ${latitud}, Longitud: ${longitudCoord}, Altitud: ${altitud} ${unidadAltitud}</td></tr>
                    </table>
                    <h3>Referencias</h3>
                    <ul>${referencias.map(ref => `<li><a href="${ref}" target="_blank">${ref}</a></li>`).join('')}</ul>
                    <h3>Fotos</h3>
                    ${fotos.map(foto => `<picture><img src="${foto}" alt="circuito de monza"/></picture>`).join('')}
                    <h3>Videos</h3>
                    ${videos.map(video => `<video controls preload="auto"><source src="${video}"></video>`).join('')}
                    <h2>Tramos del Circuito</h2>
                   <ol>
                `;
                let index = 1;
                tramos.forEach(tramo => {
                    outputHtml += `
                        <li> Tramo
                            <ul>
                                <li>Distancia: ${tramo.distancia} ${tramo.unidadDistancia}</li>
                                <li>Longitud: ${tramo.longitudCoord}</li>
                                <li>Latitud: ${tramo.latitud}</li>
                                <li>Altitud: ${tramo.altitud} ${tramo.unidadAltitud}</li>
                                <li>Sector: ${tramo.sector}</li>
                            </ul>
                        </li>
                    `;
                });

                outputHtml += `
                        </ol>
                `;

                $("section:last").html(outputHtml);
            };

            lector.readAsText(archivo);
        } else {
            $('section:last').append('<p>Error : ¡¡¡ Archivo no válido !!!</p>');
        }
    }
}

const circuito = new Circuito();
