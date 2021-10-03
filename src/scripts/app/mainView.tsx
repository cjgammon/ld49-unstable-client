import React from 'react';
import history from 'scripts/utils/history';

export default class MainView extends React.Component{

    
    handle_singlePlayer_CLICK() {
        history.push('/game');
    }

    handle_multiPlayer_CLICK() {
        history.push('/game/1234');
    }

    render() {
        return (<div>
            <div>
                hello
                <button onClick={this.handle_singlePlayer_CLICK}>single player</button>
                <button disabled onClick={this.handle_multiPlayer_CLICK}>multi player</button>
            </div>
        </div>);
    }
}
