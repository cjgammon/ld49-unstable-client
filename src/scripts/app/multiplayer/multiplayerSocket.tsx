import bus from 'scripts/events/eventBus';
import AppModel from 'scripts/models/appModel';
import io, { Socket } from 'socket.io-client';

let socket: Socket

export default class MultiplayerSocket{

    static CONNECT: string = 'onConnect';
    static GET_DECK: string = 'onGetDeck'; // generage/get initial deck on client
    static REQUEST_CARDS: string = 'onRequestCards';
    static RECEIVE_CARDS: string = 'onRecieveCards';
    static UPDATE_CARDS: string = 'onUpdateCards';
    static SET_CARDS: string = 'onSetCards';
    static PLAYERS_UPDATE: string = 'onPlayersUpdate';
    static PLAY_CARD: string = 'onPlayCard';
    static PLAY_THEIR_CARD: string = 'onPlayTheirCard';
    static EVALUATED: string = 'onEvaluated';

    room: string;

    constructor(room) {
        this.room = room;

        socket = io();

        socket.on("connect", () => this.handleConnect());
        socket.on("disconnect", () => this.handleDisconnect());
        socket.on("get deck", (e) => this.handleGetDeck());
        socket.on("card played", (card) => this.handleCardPlayed(card));
        socket.on("update players", (e) => this.handleUpdatePlayers(e));
        socket.on("room full", (e) => this.handleRoomFull(e));
        socket.on("evaluated cards", (e) => this.handleEvaluated(e));
        socket.on("receive cards", (cards) => this.handleReceiveCards(cards));

        bus.subscribe(MultiplayerSocket.SET_CARDS, (cards) => this.handleSetCards(cards));
        bus.subscribe(MultiplayerSocket.PLAY_CARD, (card) => this.handlePlayCard(card));
        bus.subscribe(MultiplayerSocket.REQUEST_CARDS, () => this.handleRequestCards());
    }

    handleConnect() {
        AppModel.uid = socket.id;
        AppModel.room = this.room;

        console.log('handleConnect', socket.id, socket); // x8WIv7-mJelg7on_ALbx
        socket.emit('join room', this.room);

        bus.dispatch(MultiplayerSocket.CONNECT, {id: socket.id, room: this.room});
    }

    handleGetDeck() {
        bus.dispatch(MultiplayerSocket.GET_DECK);
    }

    handleUpdatePlayers(e) {
        bus.dispatch(MultiplayerSocket.PLAYERS_UPDATE, e);
    }

    handleSetCards(cards) {
        socket.emit('set cards', cards);
    }

    handleRequestCards() {
        socket.emit('request cards');
    }

    handleReceiveCards(cards) {
        bus.dispatch(MultiplayerSocket.RECEIVE_CARDS, cards);
    }

    handlePlayCard(card) {

        let cardData = {
            id: card.id,
            src: card.img.src, 
            value: card.value, 
            owner: AppModel.uid
        };

        socket.emit('play card', cardData);
    }

    handleCardPlayed(card) {
        bus.dispatch(MultiplayerSocket.PLAY_THEIR_CARD, card);
    }

    handleEvaluated(result) {
        bus.dispatch(MultiplayerSocket.EVALUATED, result);
    }

    handleRoomFull(e) {
        console.log('room full');
    }

    handleDisconnect() {

    }
}