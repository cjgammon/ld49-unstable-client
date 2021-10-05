import React from 'react';

import GameCanvas from './gameCanvas';

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
    gameCanvas: GameCanvas;

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
        this.gameCanvas = new GameCanvas(this.context, this.state.width, this.state.height);

        setTimeout(() => {
            this.gameCanvas.interactive = true;
        }, 1000)

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
