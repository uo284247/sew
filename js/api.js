"use strict";

class Api {
    

    createEscuderia({ name, url }) {
        const main = document.querySelector("main");
        const firstSection = main.querySelector("section");
        const escuderia = document.createElement("section");
    
        const h4 = document.createElement("h4");
        h4.textContent = name;
        escuderia.appendChild(h4);
    
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.src = url;
        escuderia.appendChild(audio);
    
        firstSection.appendChild(escuderia);
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const gainNode = audioContext.createGain();
    
        const introAudio = new Audio();
        introAudio.src = './multimedia/audios/salida.mp3';
        introAudio.crossOrigin = "anonymous"; 
        introAudio.loop = false; 
        const track = audioContext.createMediaElementSource(audio);
        track.connect(gainNode).connect(audioContext.destination);

        let reproAudioPrincipal = false;
        audio.addEventListener("play", async () => {
            
            if (reproAudioPrincipal){
                return;
            }
            else{
                audio.pause();
            }
            
            if (audioContext.state === "suspended") {
                await audioContext.resume();
            }

            introAudio.playbackRate = 1.25;  
            introAudio.play();  

            introAudio.onended = () => {
                reproAudioPrincipal = true;
                audio.play();
                fadeIn(3);
            };
        });
    
        function fadeIn(duration = 3) {
            const currentTime = audioContext.currentTime;
            
            // Establecer el volumen inicial en 0 (silencio)
            gainNode.gain.setValueAtTime(0, currentTime);
            
            // Aumentar el volumen hasta 1 (máximo) durante la duración especificada
            gainNode.gain.linearRampToValueAtTime(1, currentTime + duration);
        }
    
        // Manejo básico de errores
        audio.addEventListener('error', (e) => {
            console.error('Error al cargar o reproducir el audio:', e);
            playButton.disabled = true;
            stopButton.disabled = true;
        });
    }

    createTuEquipo({ name, url }) {
        const section = document.querySelector("main > section:last-of-type");
        const escuderia = document.createElement("section");
    
        const h4 = document.createElement("h4");
        h4.textContent = name;
        escuderia.appendChild(h4);
    
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.src = url;
        escuderia.appendChild(audio);
    
        section.appendChild(escuderia);
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const gainNode = audioContext.createGain();
    
        const introAudio = new Audio();
        introAudio.src = './multimedia/audios/salida.mp3';
        introAudio.crossOrigin = "anonymous"; 
        introAudio.loop = false; 
        const track = audioContext.createMediaElementSource(audio);
        track.connect(gainNode).connect(audioContext.destination);

        let reproAudioPrincipal = false;
        audio.addEventListener("play", async () => {
            
            if (reproAudioPrincipal){
                return;
            }
            else{
                audio.pause();
            }
            
            if (audioContext.state === "suspended") {
                await audioContext.resume();
            }

            introAudio.playbackRate = 1.25;  
            introAudio.play();  

            introAudio.onended = () => {
                reproAudioPrincipal = true;
                audio.play();
                fadeIn(3);
            };
        });

        function fadeIn(duration = 3) {
            const currentTime = audioContext.currentTime;
            
            // Establecer el volumen inicial en 0 (silencio)
            gainNode.gain.setValueAtTime(0, currentTime);
            
            // Aumentar el volumen hasta 1 (máximo) durante la duración especificada
            gainNode.gain.linearRampToValueAtTime(1, currentTime + duration);
        }
    
    
        // Manejo básico de errores
        audio.addEventListener('error', (e) => {
            console.error('Error al cargar o reproducir el audio:', e);
            playButton.disabled = true;
            stopButton.disabled = true;
        });
    }

    

    crearEquipo(){
        $("form").on("submit", (event) => {  // Usamos una función de flecha aquí
            event.preventDefault();

            const inputs = $("main input");

            const equipo = $(inputs[0]).val().trim();
            const audio = $(inputs[1])[0];
            if (equipo && audio && audio.files && audio.files[0] && audio.files[0].type.startsWith("audio/")) {
                const audioUrl = URL.createObjectURL(audio.files[0]);
                const audioFile = audio.files[0];

                this.saveAudioToDB(audioFile, equipo);
                this.createTuEquipo({ name: equipo, url: audioUrl });  
            }
            $(inputs).val('') 
        });
    }    
    
    openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("audiosDB", 1);
    
            // Si no existe la base de datos o la versión ha cambiado, se crea
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains("audios")) {
                    const store = db.createObjectStore("audios", { keyPath: "name" });
                    store.createIndex("name", "name", { unique: true });
                }
            };
    
            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e.target.error);
        });
    }
    
    saveAudioToDB(audioFile, name) {
        this.openDB().then(db => {
            const transaction = db.transaction("audios", "readwrite");
            const store = transaction.objectStore("audios");
    
            const audioData = {
                name: name,      // El nombre del equipo
                file: audioFile  // El archivo de audio
            };
    
            store.put(audioData); // Guarda el equipo y el archivo de audio
        }).catch(console.error);
    }

    loadAudiosFromDB() {
        this.openDB().then(db => {
            const transaction = db.transaction("audios", "readonly");
            const store = transaction.objectStore("audios");
            const request = store.getAll(); // Recupera todos los elementos almacenados
    
            request.onsuccess = () => {
                const audios = request.result;
                audios.forEach(audio => {
                    this.createTuEquipo({ name: audio.name, url: URL.createObjectURL(audio.file) });
                });
            };
        }).catch(console.error);
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
api.openDB();
archivosDeAudio.forEach(audio => api.createEscuderia(audio));
api.loadAudiosFromDB()
api.crearEquipo();
