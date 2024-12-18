  
"use strict"; //comprobación estricta de tipos
        
class Memoria {

	constructor(){
        this.hasFlippedCard = false;    
        this.lockBoard = false;         
        this.firstCard = null;          
        this.secondCard = null; 
        this.gameFinished = false;
        this.timer = 0;
        this.timerInterval = null;

        this.elements = [
            {element: "Red Bull", source: "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg"},
            {element: "McLaren", source: "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg"},
            {element: "Alpine", source: "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg"},
            {element: "AstonMartin", source: "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg"},
            {element: "Ferrari", source: "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg"},
            {element: "Mercedes", source: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg"},
            {element: "Red Bull", source: "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg"},
            {element: "McLaren", source: "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg"},
            {element: "Alpine", source: "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg"},
            {element: "AstonMartin", source: "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg"},
            {element: "Ferrari", source: "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg"},
            {element: "Mercedes", source: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg"}
        ]
        this.shuffleElements(); 
        this.createElements();
        this.addEventListeners();
    }

    shuffleElements() {
        for (let i = this.elements.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
        }
    }

    unflipCards(){
        this.lockBoard = true;

        setTimeout(() => {
            this.firstCard.dataset.state = 'initial'
            this.secondCard.dataset.state = 'initial'
            this.resetBoard();
        }, "1000")
        
    }

    resetBoard(){
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false;
        this.hasFlippedCard = false;
        this.gameFinished = false;
    }

    checkForMatch(){
        if (this.firstCard.dataset.element == this.secondCard.dataset.element){
            this.disableCards()
        } else{
            this.unflipCards()
        }
    }

    disableCards(){
        this.firstCard.dataset.state = 'revealed'
        this.secondCard.dataset.state = 'revealed'
        this.resetBoard()
        this.checkIfGameFinished();
    }

    checkIfGameFinished() {
        const cards = document.querySelectorAll('article');
        const allRevealed = Array.from(cards).every(card => card.dataset.state === 'revealed');

        if (allRevealed) {
            this.stopTimer();
            this.gameFinished = true;
            setTimeout(() => {
                this.showGameFinishedMessage();
                const cards = document.querySelectorAll('article');
                cards.forEach(card => {
                    card.dataset.state = 'initial';
                });
            }, 500); 
        }
    }

    showGameFinishedMessage() {

        const message = document.createElement('p');
        message.textContent = "¡Felicidades! Has completado el juego";

        const restartButton = document.createElement('button');
        restartButton.textContent = "Reiniciar juego";

        restartButton.addEventListener('click', () => {
            this.restartGame();
        });

        const cronometroElement = $("main p");
        if (cronometroElement) {
            cronometroElement.after(restartButton);
            cronometroElement.after(message);
        }
    }

    showTimeFinish() {

        const message = document.createElement('p');
        message.textContent = "Se ha agotado el tiempo";

        const restartButton = document.createElement('button');
        restartButton.textContent = "Reiniciar juego";

        restartButton.addEventListener('click', () => {
            this.restartGame();
        });

        const cronometroElement = $("main p");
        if (cronometroElement) {
            cronometroElement.after(restartButton);
            cronometroElement.after(message);
        }
    }

    restartGame() {
        const time = document.querySelector('main p:first-of-type');
        if (time){
            time.textContent = 'Tiempo: 0s';
        }
        const message = document.querySelector('main p:last-of-type');
        if (message) {
            message.remove();
        }
        const restartButton = document.querySelector('main button');
        if (restartButton){
            restartButton.remove();
        }

        this.timerInterval = null;
        this.shuffleElements();
        this.resetBoard();
        this.updateCards();
        
    }

    updateCards() {
        const cards = document.querySelectorAll('article');

        cards.forEach((card, index) => {
            const elementData = this.elements[index];

            card.dataset.element = elementData.element;
            card.dataset.state = 'initial';

            const img = card.querySelector('img');
            img.src = elementData.source;
            img.alt = elementData.element;
        });
    }

    createElements() {
        const gameMain = document.querySelector('main');

        this.elements.forEach(item => {
            const card = document.createElement('article');
            card.classList.add('card');
            card.dataset.element = item.element; 
            card.dataset.state = 'initial';

            // Encabezado
            const h3 = document.createElement('h3');
            h3.textContent = 'Tarjeta de memoria';
            card.appendChild(h3);

            // Imagen
            const img = document.createElement('img');
            img.src = item.source;
            img.alt = item.element;
            card.appendChild(img);

            gameMain.appendChild(card);
        });
    }

    addEventListeners() {
        const gameMain = document.querySelector('main');

        // Selecciona todas las tarjetas (article)
        const cards = gameMain.querySelectorAll('article');

        // Agrega un evento click a cada tarjeta
        cards.forEach(card => {
            card.addEventListener('click', this.flipCard.bind(this, card));
        });
    }

    startTimer() {
        const cronometroElement = $("main p");
        this.timer = 0; 
        this.timerInterval = setInterval(() => {
            this.timer++;
            cronometroElement.text(`Tiempo: ${this.timer}s`);
            if (this.timer >= 300){
                this.stopTimer();
                this.showTimeFinish();
            }
        }, 1000); 
    }

    stopTimer() {
        clearInterval(this.timerInterval);
    }

    flipCard(card) {
        if (this.gameFinished) return;
        if (card.dataset.state === 'revealed') return; 
        if (this.lockBoard) return; 
        if (card === this.firstCard) return; 

        if (!this.hasFlippedCard && this.timerInterval === null) {
            this.startTimer(); 
        }

        card.dataset.state = 'flip';

        if (!this.hasFlippedCard) {
            this.hasFlippedCard = true; 
            this.firstCard = card; 
        } else {
            this.secondCard = card; 
            this.checkForMatch(); 
        }
    }

    help(){
        $(document).ready(() => {  
            const firstButton = $("button:nth-of-type(1)");
        
            const guia = '<p>Haz parejas de las escuderias de la F1</p>';
            const guia2 = '<p>Tarjetas de memoria iguales:</p>'
            const guia3 = '<p>Tarjetas de memoria diferentes:</p>'
            const correctPicture = document.createElement('picture');
            correctPicture.innerHTML = `
                <source media="(max-width: 465px)" srcset="./multimedia/imagenes/correctImg_small.png">
                <source media="(max-width: 799px)" srcset="./multimedia/imagenes/correctImg_medium.png">
                <source media="(min-width: 800px)" srcset="./multimedia/imagenes/correctImg.png">
                <img src="./multimedia/imagenes/correctImg.png" alt="Dos tarjetas pareja">
            `;
    
            const wrongPicture = document.createElement('picture');
            wrongPicture.innerHTML = `
                <source media="(max-width: 465px)" srcset="./multimedia/imagenes/wrongImg_small.png">
                <source media="(max-width: 799px)" srcset="./multimedia/imagenes/wrongImg_medium.png">
                <source media="(min-width: 800px)" srcset="./multimedia/imagenes/wrongImg.png">
                <img src="./multimedia/imagenes/wrongImg.png" alt="Dos tarjetas diferentes">
            `;
            firstButton.click(() => {
                firstButton.after(wrongPicture);
                firstButton.after(guia3);
                firstButton.after(correctPicture);
                firstButton.after(guia2);
                firstButton.after(guia);

                firstButton.remove();
            });
        });
        
    }
}

const juegoMemoria = new Memoria();
juegoMemoria.help();