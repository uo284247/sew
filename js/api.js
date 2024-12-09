"use strict";

class Api {
    

    createEscuderia() {
        // Crear el contenedor para la escudería
        const main = document.querySelector("main");
        const escuderia = document.createElement("section");
    
        // Crear un título para la escudería
        const h3 = document.createElement("h3");
        h3.textContent = "Red Bull";
        escuderia.appendChild(h3);
    
        // Crear botones Play y Stop
        const playButton = document.createElement("button");
        const stopButton = document.createElement("button");
        playButton.textContent = "Play";
        stopButton.textContent = "Stop";
        escuderia.appendChild(playButton);
        escuderia.appendChild(stopButton);
    
        // Deshabilitar Stop inicialmente
        stopButton.disabled = true;
    
        // Agregar la sección al contenedor principal
        main.appendChild(escuderia);
    
        // Cargar el archivo de audio
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audio = new Audio('./multimedia/audios/ferrari.mp3');
        audio.crossOrigin = "anonymous";
        const track = audioContext.createMediaElementSource(audio);
        const gainNode = audioContext.createGain();
    
        // Configurar nodos y conexiones
        gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Volumen inicial en 0
        track.connect(gainNode).connect(audioContext.destination);
    
        // Estado para evitar conflictos entre fades y almacenar acciones pendientes
        let isFading = false;
        let pendingAction = null;
    
        // Evento para botón de reproducción
        playButton.addEventListener("click", () => {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
                fadeIn(3);
                audio.play();
    
                // Deshabilitar botones correspondientes
                playButton.disabled = true;
                stopButton.disabled = false;
        });
    
        // Evento para botón de stop
        stopButton.addEventListener("click", () => {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
    
    
                // Cancelar cualquier fade anterior y ejecutar fade-out
                fadeOut(3).then(() => {
                    isFading = false;
                    audio.pause();
                    audio.currentTime = 0; // Reiniciar al inicio
                    playButton.disabled = false;
                });
    
                // Deshabilitar botones correspondientes
                stopButton.disabled = true;
            
        });
    
        // Función para el efecto de fade-in
        function fadeIn(duration = 3) {
            const currentTime = audioContext.currentTime;
            gainNode.gain.cancelScheduledValues(currentTime); // Cancelar valores previos
            gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime); // Configurar valor actual
            gainNode.gain.linearRampToValueAtTime(1, currentTime + duration); // Subir volumen a 1
            setTimeout(() => {
                resolve();
            }, duration * 1000);
        }
    
        // Función para el efecto de fade-out
        function fadeOut(duration = 3) {
            return new Promise((resolve) => {
                const currentTime = audioContext.currentTime;
                gainNode.gain.cancelScheduledValues(currentTime); // Cancelar valores previos
                gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime); // Configurar valor actual
                gainNode.gain.linearRampToValueAtTime(0, currentTime + duration); // Bajar volumen a 0
    
                // Resolvemos la promesa después del fade-out
                setTimeout(() => {
                    resolve();
                }, duration * 1000);
            });
        }
    
    
        // Manejo básico de errores
        audio.addEventListener('error', (e) => {
            console.error('Error al cargar o reproducir el audio:', e);
            playButton.disabled = true;
            stopButton.disabled = true;
        });
    }
    
    

}

const archivosDeAudio = [
    { name: "Alpine", url: "./multimedia/audios/alpine.mp3" },
    { name: "Aston Martin", url: "./multimedia/audios/aston_martin.mp3" },
    { name: "Ferrari", url: "./multimedia/audios/ferrari.mp3" },
    { name: "Haas", url: "./multimedia/audios/haas.mp3" },
    { name: "Mclaren", url: "./multimedia/audios/mclaren.mp3" },
    { name: "Mercedes", url: "./multimedia/audios/mercedes.mp3" },
    { name: "RB", url: "./multimedia/audios/rb.mp3" },
    { name: "Red Bull", url: "./multimedia/audios/redbull.mp3" },
    { name: "Kick Sauber", url: "./multimedia/audios/sauber.mp3" },
    { name: "Williams", url: "./multimedia/audios/williams.mp3" }
];

const api = new Api();
api.createEscuderia();
