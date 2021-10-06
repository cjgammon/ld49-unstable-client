import React from 'react';
import {
    Switch,
    Route,
    withRouter
  } from "react-router-dom";

import Database from './utils/DB';

import './styles.less';

import MainView from './app/mainView';
import GameView from './app/game/gameView';
import MultiplayerView from './app/multiplayer/multiplayerView';

import IMXModel from './models/IMXModel';
import AppModel from './models/appModel';
import MumbaiModel from './models/MumbaiModel';

interface Props{
    history: any
}

export class App extends React.Component<Props>{

    constructor(props) {
        super(props);

        window._db = new Database();
        window._db.oncomplete = this.db_complete.bind(this);

        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());

        if (params.mode) {
            AppModel.mode = params.mode;

            switch(AppModel.mode) {
                case 'mumbai':
                    AppModel.bcModel = new MumbaiModel();
                    break;
            }
        } else {
            AppModel.bcModel = new IMXModel();
        }
    }

    db_complete() {
        console.log('db complete');
    }

    render() {
        return this.renderContent();
    }

    renderContent() {
        return (
            <Switch>
                <Route path="/game/:room" component={MultiplayerView}></Route>
                <Route path="/game">
                    <GameView/>
                </Route>
                <Route path="/">
                    <MainView/>
                </Route>
            </Switch>
        );
    }
}

export default withRouter(App);