export default class Card{

    value: number;
    x: number;
    y: number;
    side: number = 0;
    img: HTMLImageElement
    w: number = 200;
    h: number = 300;

    constructor(x?, y?, value?) {
        this.x = x || 0;
        this.y = y || 0;
        this.value = value || Math.floor(Math.random() * 100);

        this.img = new Image();
        this.img.src = `./assets/images/cards/card${Math.floor(Math.random() * 3)}.png`;
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
        ctx.rect(0, 0, this.w, this.h);
        ctx.closePath();
        ctx.stroke();

        if (this.side == 1) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, this.w, this.h);

            if (this.img.complete) {
                ctx.drawImage(this.img, 0, 0);
            }
    
            ctx.fillStyle = 'black';
            ctx.font = '20px serif';
            let valueText = this.value.toString();
            let valueTextPadding = 20;
            let valueTextX = this.w - ctx.measureText(valueText).width - (valueTextPadding / 2);
            ctx.fillText(valueText, valueTextX, valueTextPadding);
        } else {
            ctx.fillStyle = 'blue';
            ctx.fillRect(0, 0, this.w, this.h);
        }

        ctx.restore();
    }
}