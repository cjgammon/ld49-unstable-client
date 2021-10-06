import gsap from 'gsap/all';
import bus from 'scripts/events/eventBus';
import AppModel from 'scripts/models/appModel';
import Card from '../components/card';
import MultiplayerSocket from './multiplayerSocket';



export default class GameCanvas{

    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;

    //myid: string = '';
    //theirid: string = '';

    CARDS_MINE: Card[] = [];
    CARDS_THEIRS: Card[] = [];
    ties: number = 0;

    gameState = 'waiting';

    interactive: boolean = false;

    constructor(ctx, w, h) {
        this.ctx = ctx;
        this.width = w;
        this.height = h;

        bus.subscribe(MultiplayerSocket.PLAYERS_UPDATE, (e) => this.handle_PLAYERS_UPDATE(e))
        bus.subscribe(MultiplayerSocket.GET_DECK, () => this.handle_GET_DECK())
        bus.subscribe(MultiplayerSocket.RECEIVE_CARDS, (cards) => this.handle_RECEIVE_CARDS(cards))
        bus.subscribe(MultiplayerSocket.PLAY_THEIR_CARD, (card) => this.handle_PLAY_THEIR_CARD(card))
        bus.subscribe(MultiplayerSocket.EVALUATED, (card) => this.handle_EVALUATED(card))

        window.addEventListener('click', (e) => this.handle_CLICK(e));
    }

    handle_GET_DECK() {
        this.CARDS_MINE = [];
        for (let i = 0; i < 100; i++) {
            this.CARDS_MINE.push(new Card(i, this.width / 2, this.height - 100));
        }
        bus.dispatch(MultiplayerSocket.SET_CARDS, this.CARDS_MINE);
    }

    handle_RECEIVE_CARDS(cards) {
        console.log('recieve cards');
        let myCards = [];
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            myCards.push(new Card(card.id, this.width / 2, this.height - 100, card.value, card.src));
        }
        this.CARDS_MINE = myCards;

        //TODO:: handle no cards.

        this.interactive = true;
    }

    //NOTE:: this is only used for their cards..
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
                    this.CARDS_THEIRS.push(new Card(i, this.width / 2, -200));
                }
            }
        }

        //TODO:: handle no cards...
    }

    handle_EVALUATED(result) {
        if (result === 'tie') {
            this.playMyCard();
        } else {
            this.collectCard(result === AppModel.uid);
        }
    }

    handle_CLICK(e) {
        if (this.interactive) {
            this.playMyCard();
        }
        this.interactive = false;
    }

    playMyCard() {

        let myIndex = this.CARDS_MINE.length - 1;
        const myCard = this.CARDS_MINE[myIndex];

        const centerX = this.width / 2;
        const centerY = this.height / 2;

        let playAnim = gsap.timeline();

        let offsetX = this.ties * 100;
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

        bus.dispatch(MultiplayerSocket.PLAY_CARD, myCard);
    }

    handle_PLAY_THEIR_CARD(card) {

        let theirIndex = this.CARDS_THEIRS.length - 1;
        const theirCard = this.CARDS_THEIRS[theirIndex];

        theirCard.setData(card.value, card.src);

        const centerX = this.width / 2;
        const centerY = this.height / 2;

        let playAnim = gsap.timeline();

        let offsetX = this.ties * 100;
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

    */

    collectCard(myCardWin) {
        this.ties = 0;

        let myIndex = this.CARDS_MINE.length - 1;
        const myCard = this.CARDS_MINE[myIndex];
        let theirIndex = this.CARDS_THEIRS.length - 1;
        const theirCard = this.CARDS_THEIRS[theirIndex];

        let cards = [myCard, theirCard];

        const centerX = this.width / 2;

        let collectAnim = gsap.timeline({
            onComplete: () => {
                //request updated decks...
                console.log('request cards1');
                bus.dispatch(MultiplayerSocket.REQUEST_CARDS);
            }
        });

        console.log('mycardwin?', myCardWin);

        let winnerY = myCardWin ? this.height - 100 : -200;
        collectAnim.to(cards, {
            x: centerX, 
            y: winnerY, 
            duration: 0.4,
            stagger: 0.1
        });

        collectAnim.call(() => {
            cards.forEach((card: Card, index: number) => {
                card.flip();
                if (myCardWin) {
                    this.CARDS_MINE.unshift(card);
                } else {
                    this.CARDS_THEIRS.unshift(card);
                }
            });

            cards = [];
        }, [], '+=1');
    }

    draw() {
        let ctx = this.ctx;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    
        const allCards = this.CARDS_THEIRS.concat(this.CARDS_MINE);
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