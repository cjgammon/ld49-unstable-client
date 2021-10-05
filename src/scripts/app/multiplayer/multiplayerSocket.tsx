import bus from 'scripts/events/eventBus';
import AppModel from 'scripts/models/appModel';
import io, { Socket } from 'socket.io-client';

let socket: Socket

export default class MultiplayerSocket{

    static CONNECT: string = 'onConnect';
    static REQUEST_CARDS: string = 'onRequestCards';
    static SET_CARDS: string = 'onSetCards';
    static PLAYERS_UPDATE: string = 'onPlayersUpdate';
    static PLAY_CARD: string = 'onPlayCard';
    static PLAY_THEIR_CARD: string = 'onPlayTheirCard';

    room: string;

    constructor(room) {
        this.room = room;

        socket = io();

        console.log('room?', room);

        socket.on("connect", () => this.handleConnect());
        socket.on("disconnect", () => this.handleDisconnect());
        socket.on("request cards", (e) => this.handleRequestCards());
        socket.on("card played", (card) => this.handleCardPlayed(card));
        socket.on("update players", (e) => this.handleUpdatePlayers(e));
        socket.on("room full", (e) => this.handleRoomFull(e));
        socket.on("message", (e) => this.handleMessage(e));

        bus.subscribe(MultiplayerSocket.SET_CARDS, (cards) => this.handleSetCards(cards))
        bus.subscribe(MultiplayerSocket.PLAY_CARD, (card) => this.handlePlayCard(card))

    }

    handleConnect() {
        AppModel.uid = socket.id;
        AppModel.room = this.room;

        console.log('handleConnect', socket.id, socket); // x8WIv7-mJelg7on_ALbx
        socket.emit('join room', this.room);

        bus.dispatch(MultiplayerSocket.CONNECT, {id: socket.id, room: this.room});
    }

    handleRequestCards() {
        bus.dispatch(MultiplayerSocket.REQUEST_CARDS);
    }

    handleUpdatePlayers(e) {
        console.log('players:', e);
        bus.dispatch(MultiplayerSocket.PLAYERS_UPDATE, e);
    }

    handleSetCards(cards) {
        socket.emit('set cards', cards);
    }

    handlePlayCard(card) {

        let cardData = {
            id: card.id,
            src: card.img.src, 
            value: card.value, 
            owner: AppModel.uid
        };

        console.log('play card', cardData);
        socket.emit('play card', cardData);
    }

    handleCardPlayed(card) {
        bus.dispatch(MultiplayerSocket.PLAY_THEIR_CARD, card);
    }

    handleRoomFull(e) {
        console.log('room full');
    }

    handleMessage(e) {
        console.log('message', e);
    }

    handleDisconnect() {
        console.log('disconnect', socket.id); // undefined
    }
}