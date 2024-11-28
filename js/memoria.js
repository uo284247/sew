  
"use strict"; //comprobación estricta de tipos
        
class Memoria {

	constructor(){
        this.hasFlippedCard = false;    
        this.lockBoard = false;         
        this.firstCard = null;          
        this.secondCard = null; 

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
    }

    createElements() {
        const gameSection = document.querySelector('section');

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

            gameSection.appendChild(card);
        });
    }

    addEventListeners() {
        const gameSection = document.querySelector('section');

        // Selecciona todas las tarjetas (article)
        const cards = gameSection.querySelectorAll('article');

        // Agrega un evento click a cada tarjeta
        cards.forEach(card => {
            card.addEventListener('click', this.flipCard.bind(this, card));
        });
    }

    flipCard(card) {
        // Comprobaciones
        if (card.dataset.state === 'revealed') return; 
        if (this.lockBoard) return; 
        if (card === this.firstCard) return; 

        card.dataset.state = 'flip';

        if (!this.hasFlippedCard) {
            this.hasFlippedCard = true; 
            this.firstCard = card; 
        } else {
            this.secondCard = card; 
            this.checkForMatch(); 
        }
    }
}

const juegoMemoria = new Memoria();