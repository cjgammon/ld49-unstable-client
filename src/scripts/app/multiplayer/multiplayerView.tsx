import React from 'react';

import MultiplayerCanvas from './multiplayerCanvas';
import MultiplayerSocket from './multiplayerSocket';

interface State{
    width: number;
    height: number;
}

interface Props{
    room?: string
}

export default class GameView extends React.Component<Props, State>{

    canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();
    canvas: HTMLCanvasElement = null;
    context: CanvasRenderingContext2D = null;
    gameCanvas: MultiplayerCanvas;
    socket: MultiplayerSocket;

    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }

    componentDidMount() {
        this.canvas = this.canvasRef.current;
        this.context = this.canvas.getContext('2d');
        this.gameCanvas = new MultiplayerCanvas(this.context, this.state.width, this.state.height);

        this.socket = new MultiplayerSocket(this.props.room);

        requestAnimationFrame(() => this.draw());
    }

    draw() {
        this.gameCanvas.draw();
        requestAnimationFrame(() => this.draw());
    }

    render() {
        return (<div>
            <canvas 
                ref={this.canvasRef as React.RefObject<HTMLCanvasElement>}
                width={this.state.width}
                height={this.state.height}></canvas>
        </div>);
    }
}
