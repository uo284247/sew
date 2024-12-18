class Agenda {
    constructor(url) {
        this.url = url;
    }

    escribirAgenda() {
        $(document).ready(() => {  
            $("button:nth-of-type(1)").click(() => {
                $("button:nth-of-type(1)").prop("disabled", true);
                this.obtenerAgenda(); 
                $("main").append("<section></section>");
            });
        });
    }

    obtenerAgenda() {
        $.ajax({
            dataType: "json",
            url: this.url,
            method: 'GET',
            success: (datos) => {  // Usamos función flecha aquí también
                var carreras = datos.MRData.RaceTable.Races;
                var carrerasList = "";
                carreras.forEach(carrera => {
                    carrerasList += "<h3>" + carrera.raceName + "</h3>";
                    carrerasList += "<p>Circuito: " + carrera.Circuit.circuitName + " </p>";
                    carrerasList += "<p>Coordenadas: " + carrera.Circuit.Location.lat +" lat " + carrera.Circuit.Location.long + " long" + "</p>";
                    carrerasList += "<p>Fecha: " + carrera.date + "</p>";
                    carrerasList += "<p>Hora: " + carrera.time + "</p>";
                });
                // Agregamos el contenido al DOM aquí
                $("section").append(carrerasList);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Error en la llamada AJAX: " + textStatus + ", " + errorThrown);
            }
        });
    }
}

const agenda = new Agenda("https://api.jolpi.ca/ergast/f1/current");
agenda.escribirAgenda();
