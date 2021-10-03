import gsap from 'gsap/all';
import Card from './game/card';

export default class GameCanvas{

    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;

    CARDS_MINE: Card[] = [];
    CARDS_THEIRS: Card[] = [];
    CARDS_TABLE: Card[] = [];

    interactive: boolean = true;

    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.width = w;
        this.height = h;

        let centerX = this.width / 2;

        for (let i = 0; i < 100; i++) {
            this.CARDS_MINE.push(new Card(centerX + i, this.height - 100));
            this.CARDS_THEIRS.push(new Card(centerX + i, 0));
        }

        window.addEventListener('click', (e) => this.handle_CLICK(e));
    }

    handle_CLICK(e) {
        if (this.interactive) {
            this.playCard();
        }
        this.interactive = false;
    }

    playCard() {

        let myIndex = this.CARDS_MINE.length - 1;
        let theirIndex = this.CARDS_THEIRS.length - 1;
        const myCard = this.CARDS_MINE[myIndex];
        const theirCard = this.CARDS_THEIRS[theirIndex];

        const centerX = this.width / 2;
        const centerY = this.height / 2;

        let playAnim = gsap.timeline();


        let offsetX = (this.CARDS_TABLE.length / 2) * 100;
        let posX = centerX + offsetX;
        
        //draw cards
        playAnim.to(myCard, {
            x: posX, 
            y: centerY + 50, 
            duration: 0.4, 
            onComplete: () => {
                myCard.flip();
            }
        }, 0);

        playAnim.to(theirCard, {
            x: posX, 
            y: centerY - 100, 
            duration: 0.4, 
            onComplete: () => {
                theirCard.flip();
            }
        }, 0);

        playAnim.call(() => {

            let myCardWin;
            if (myCard.value > theirCard.value) {
                myCardWin = true;
            } else if (myCard.value < theirCard.value) {
                myCardWin = false;
            }

            let cardA = this.CARDS_MINE.splice(myIndex, 1);
            let cardB = this.CARDS_THEIRS.splice(theirIndex, 1);
            this.CARDS_TABLE = this.CARDS_TABLE.concat(cardA, cardB);

            if (myCard.value === theirCard.value) {
                this.playCard();
                return;
            }

            this.collectCard(myCardWin);

        }, [], '+=1');
      
    }

    collectCard(myCardWin) {
        const centerX = this.width / 2;

        let collectAnim = gsap.timeline({onComplete: () => {
            this.interactive = true;
        }});

        let winnerY = myCardWin ? this.height : 0;
        collectAnim.to(this.CARDS_TABLE, {
            x: centerX, 
            y: winnerY, 
            duration: 0.4,
            stagger: 0.1
        });

        
        collectAnim.call(() => {
            this.CARDS_TABLE.forEach((card: Card, index: number) => {
                card.flip();
                if (myCardWin) {
                    this.CARDS_MINE.unshift(card);
                } else {
                    this.CARDS_THEIRS.unshift(card);
                }
            });

            this.CARDS_TABLE = [];
        }, [], '+=1');
        
    }

    draw() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    
        for (let i = 0; i < this.CARDS_MINE.length; i++) {
            this.CARDS_MINE[i].draw(this.ctx);
        }

        for (let i = 0; i < this.CARDS_THEIRS.length; i++) {
            this.CARDS_THEIRS[i].draw(this.ctx);
        }

        for (let i = 0; i < this.CARDS_TABLE.length; i++) {
            this.CARDS_TABLE[i].draw(this.ctx);
        }
    }
}