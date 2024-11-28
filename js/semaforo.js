"use strict";

class Semaforo {
    constructor() {
        this.levels = [0.2, 0.5, 0.8];
        this.lights = 4; // Número de luces del semáforo
        this.unload_moment = null;
        this.clic_moment = null;
        this.difficulty = this.initializeDifficulty(); // Inicializa la dificultad
    }

    initializeDifficulty() {
        const randomIndex = Math.floor(Math.random() * this.levels.length);
        return this.levels[randomIndex];
    }

    createStructure() {
        // Seleccionar el elemento <main> del documento
        const mainElement = document.querySelector('main');

        // Crear y añadir el encabezado para el título del juego
        const title = document.createElement('h2');
        title.textContent = 'Simulador de Semáforo';
        mainElement.appendChild(title);
        
        // Crear los bloques div para las luces del semáforo
        for (let i = 0; i < this.lights; i++) {
            const light = document.createElement('div');
            mainElement.appendChild(light); // Añadir luz al main
        }
        
        // Crear botón para arrancar el semáforo
        const startButton = document.createElement('button');
        startButton.textContent = 'Arranque';
        startButton.onclick = () => this.initSequence(startButton, mainElement); // Llama a initSequence con el botón y mainElement
        mainElement.appendChild(startButton);
        
        // Crear botón para obtener el tiempo de reacción
        const reactionButton = document.createElement('button');
        reactionButton.textContent = 'Reacción';
        reactionButton.disabled = true;
        reactionButton.onclick = () => this.stopReaction(reactionButton, mainElement);
        mainElement.appendChild(reactionButton);
    }

    initSequence(startButton, mainElement) {
        const paragraphs = mainElement.querySelector('p');
        if (paragraphs){
            paragraphs.remove();
        }
        // Añadir la clase 'load' al main para iniciar la animación
        mainElement.classList.add('load');

        // Deshabilitar el botón de arranque para evitar múltiples clicks
        startButton.disabled = true;

        const delay = 1500 + this.difficulty * 100; // Tiempo de encendido + dificultad ajustada
        setTimeout(() => {
            this.unload_moment = new Date();
            this.endSequence();
        }, delay);
    }

    endSequence() {
        const mainElement = document.querySelector('main');
        mainElement.classList.add('unload'); // Activar el apagado de luces
        document.querySelector('main > button:nth-of-type(2)').disabled = false;   
    }

    stopReaction(reactionButton, mainElement) {
        this.clic_moment = new Date(); // Obtener la fecha y hora actual
        const differenceInMilliseconds = this.clic_moment.getTime() - this.unload_moment.getTime();

        // Crear un párrafo para mostrar el tiempo de reacción
        const reactionTimeParagraph = document.createElement('p');
        reactionTimeParagraph.textContent = `Tu tiempo de reacción es: ${differenceInMilliseconds} milisegundos`;
        mainElement.appendChild(reactionTimeParagraph);

        // Restablecer el estado del semáforo
        mainElement.classList.remove('load', 'unload'); 
        reactionButton.disabled = true; 
        const startButton = mainElement.querySelector('main > button:first-of-type');
        startButton.disabled = false; 
    }
}

// Crear una instancia de Semáforo y crear la estructura en el documento
const semaforo = new Semaforo();
semaforo.createStructure();
