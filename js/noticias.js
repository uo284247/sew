  
"use strict"; //comprobación estricta de tipos
        
class Noticia {

    constructor() {
        this.compruebaNavegador();
    }

    compruebaNavegador(){
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {  
            document.write("<p>Este navegador  no soporta el API File </p>");
        }
    }

    readInputFile(files){
        var archivo = files[0];
        var tipoTexto = /text.*/;
        let noticiasArchivo = [];
        if (archivo.type.match(tipoTexto)){
        var lector = new FileReader();
        lector.onload = function (evento) {
            const lineas = lector.result.trim().split("\n");
            lineas.forEach(linea => {
                let contenido = linea.split("_");
                if (contenido.length >= 3) {
                    let article = "<article> <h3>" + contenido[0] + "</h3>";
                article += "<p>" + contenido[1] + "</p>"
                article += "<p><strong>" + contenido[2] + "</strong></p></article>"

                noticiasArchivo.push(article);
                }
            });
            let noticia = "";
            noticiasArchivo.forEach(article => {
                noticia += article;
            });
            const article = $("article"); 
            if (article.length > 0) { 
                $("article:first").before(noticia); 
            } else { 
                $("section h3").after(noticia); 
            }
        }      
        lector.readAsText(archivo);
      }else {
        errorArchivo.innerText = "Error : ¡¡¡ Archivo no válido !!!";
        }
    }

    agregarNoticia(){
        const formulario = $("form")
        formulario.on("submit", function(event) {
            event.preventDefault();
            const inputs = $("main input");

            const titulo = $(inputs[0]).val().trim();
            const entradilla = $(inputs[1]).val().trim();
            const autor = $(inputs[2]).val().trim();

            if (titulo && entradilla && autor) {
                let noticia = "<article> <h3>" + titulo + "</h3>";
                noticia += "<p>" + entradilla + "</p>";
                noticia += "<p><strong>" + autor + "<strong></p></article>"

                const article = $("article");  
                if (article.length > 0) { 
                    $("article:last").after(noticia); 
                } else { 
                    $("section h3").after(noticia); 
                }
            }
            $(inputs).val('') 
        })
    }
	
}

const noticia = new Noticia();
noticia.agregarNoticia()
