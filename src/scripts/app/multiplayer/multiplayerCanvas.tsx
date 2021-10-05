import gsap from 'gsap/all';
import bus from 'scripts/events/eventBus';
import AppModel from 'scripts/models/appModel';
import Card from '../components/card';
import MultiplayerSocket from './multiplayerSocket';



export default class GameCanvas{

    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;

    myid: string = '';
    theirid: string = '';

    CARDS_MINE: Card[] = [];
    CARDS_THEIRS: Card[] = [];
    CARDS_TABLE: Card[] = [];

    gameState = 'waiting';

    interactive: boolean = false;

    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.width = w;
        this.height = h;

        bus.subscribe(MultiplayerSocket.PLAYERS_UPDATE, (e) => this.handle_PLAYERS_UPDATE(e))
        bus.subscribe(MultiplayerSocket.REQUEST_CARDS, (e) => this.handle_REQUEST_CARDS())
        bus.subscribe(MultiplayerSocket.PLAY_THEIR_CARD, (card) => this.handle_PLAY_THEIR_CARD(card))

        window.addEventListener('click', (e) => this.handle_CLICK(e));
    }

    handle_REQUEST_CARDS() {
        console.log('request cards2');
        this.CARDS_MINE = [];
        for (let i = 0; i < 100; i++) {
            this.CARDS_MINE.push(new Card(i, this.width / 2, this.height - 100));
        }

        bus.dispatch(MultiplayerSocket.SET_CARDS, this.CARDS_MINE);
    }

    handle_PLAYERS_UPDATE(players) {
        console.log('players update', players);

        if (this.gameState === 'waiting' && players.length > 1) {
            this.interactive = true;
            this.gameState = 'playing';
        }
        
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            if (player.id !== AppModel.uid) {
                this.CARDS_THEIRS = [];
                for (let i = 0; i < player.cardCount; i++) {
                    this.CARDS_THEIRS.push(new Card(i, this.width / 2, 0));
                }
            }
        }
    }

    handle_CLICK(e) {
        if (this.interactive) {
            this.playMyCard();
        }
        this.interactive = false;
    }

    playMyCard() {

        console.log('playMyCard');

        let myIndex = this.CARDS_MINE.length - 1;
        const myCard = this.CARDS_MINE[myIndex];

        const centerX = this.width / 2;
        const centerY = this.height / 2;

        let playAnim = gsap.timeline();

        let offsetX = (this.CARDS_TABLE.length / 2) * 100;
        let posX = centerX + offsetX;

        //draw cards
        playAnim.to(myCard, {
            x: posX, 
            y: centerY, 
            duration: 0.4, 
            onComplete: () => {
                myCard.flip();
            }
        }, 0);


        //send event to server...
        bus.dispatch(MultiplayerSocket.PLAY_CARD, myCard);
    }

    handle_PLAY_THEIR_CARD(card) {

        let theirIndex = this.CARDS_THEIRS.length - 1;
        const theirCard = this.CARDS_THEIRS[theirIndex];

        console.log('play their card', card);
        theirCard.setData(card.value, card.src);

        const centerX = this.width / 2;
        const centerY = this.height / 2;

        let playAnim = gsap.timeline();

        let offsetX = (this.CARDS_TABLE.length / 2) * 100;
        let posX = centerX + offsetX;

        playAnim.to(theirCard, {
            x: posX, 
            y: centerY - theirCard.h, 
            duration: 0.4, 
            onComplete: () => {
                theirCard.flip();
            }
        }, 0);
    }
    
    /*
    evaluateCard() {
        let myIndex = this.CARDS_MINE.length - 1;
        let theirIndex = this.CARDS_THEIRS.length - 1;
        const myCard = this.CARDS_MINE[myIndex];
        const theirCard = this.CARDS_THEIRS[theirIndex];

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
            this.playMyCard();
            return;
        }

        this.collectCard(myCardWin);
    }

    collectCard(myCardWin) {
        const centerX = this.width / 2;

        let collectAnim = gsap.timeline({onComplete: () => {
            this.interactive = true;
        }});

        let winnerY = myCardWin ? this.height - 150 : -150;
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
    */

    draw() {
        let ctx = this.ctx;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    
        const allCards = this.CARDS_TABLE.concat(this.CARDS_THEIRS, this.CARDS_MINE);
        for (let i = 0; i < allCards.length; i++) {
            allCards[i].draw(ctx);
        }

        ctx.fillStyle = 'white';
        ctx.font = '48px serif';
        ctx.fillText(`${this.CARDS_MINE.length}`, 10, this.height - 100);

        ctx.fillText(`${this.CARDS_THEIRS.length}`, 10, 100);

        if (this.interactive) {
            ctx.fillText(`click`, this.width / 2, this.height / 2);
        }
    }
}