import React from 'react';
import history from 'scripts/utils/history';

export default class MainView extends React.Component{

    
    handle_singlePlayer_CLICK() {
        history.push('/game');
    }

    handle_multiPlayer_CLICK() {
        let roomId = Date.now();
        history.push(`/game/${roomId}`);
    }

    render() {
        return (<div>
            <div>
                hello
                <button onClick={this.handle_singlePlayer_CLICK}>single player</button>
                <button onClick={this.handle_multiPlayer_CLICK}>multi player</button>
            </div>
        </div>);
    }
}
