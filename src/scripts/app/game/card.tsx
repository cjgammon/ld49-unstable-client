export default class Card{

    value: number;
    x: number;
    y: number;
    side: number = 0;

    constructor(x?, y?, value?) {
        this.x = x || 0;
        this.y = y || 0;
        this.value = value || Math.floor(Math.random() * 100);
    }

    flip() {
        this.side = this.side == 0 ? 1 : 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(0, 0, 100, 100);
        ctx.closePath();
        ctx.stroke();

        if (this.side == 1) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 100, 100);
    
            ctx.fillStyle = 'black';
            ctx.font = '48px serif';
            ctx.fillText(`${this.value}`, 10, 50);
        } else {
            ctx.fillStyle = 'blue';
            ctx.fillRect(0, 0, 100, 100);
        }

        ctx.restore();
    }
}