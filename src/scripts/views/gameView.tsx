import React from 'react';

interface Props{
    room?: string
}

export default class GameView extends React.Component<Props>{

    canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();
    canvas: HTMLCanvasElement = null;
    context: CanvasRenderingContext2D = null;

    componentDidMount() {
        this.canvas = this.canvasRef.current;
        this.context = this.canvas.getContext('2d');

        //Our first draw
        this.context.fillStyle = '#000000'
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height)
    }

    render() {
        return (<div>
            <canvas ref={this.canvasRef as React.RefObject<HTMLCanvasElement>} ></canvas>
        </div>);
    }
}
