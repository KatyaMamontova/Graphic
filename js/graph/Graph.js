class Graph {
    constructor({ id, callbacks, WINDOW = {}, width = 300, height = 300 }) {

        this.WINDOW = WINDOW;

        if (id) {
            this.canvas = document.getElementById(id);
        } else {
            this.canvas = document.createElement('canvas');
            document.querySelector('body').appendChild(canvas);
        }

        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');

        this.canvas.addEventListener('wheel', callbacks.wheel, { passive: true });
        this.canvas.addEventListener('mouseup', callbacks.mouseup);
        this.canvas.addEventListener('mousedown', callbacks.mousedown);
        this.canvas.addEventListener('mousemove', callbacks.mousemove);
        this.canvas.addEventListener('mouseleave', callbacks.mouseleave);

    }

    xs(x) {
        return (x - this.WINDOW.LEFT) / this.WINDOW.WIDTH * this.canvas.width
    }

    ys(y) {
        return (this.canvas.height - (y - this.WINDOW.BOTTOM) / this.WINDOW.HEIGHT * canvas.height)
    }

    sx(x) {
        return x * this.WINDOW.WIDTH / this.canvas.width
    }
    sy(y) {
        return -y * this.WINDOW.HEIGHT / this.canvas.height
    }

    clear() {
        this.context.fillStyle = 'whitesmoke';
        this.context.fillRect(0, 0, canvas.width, canvas.height);
    }

    dash() {
        this.context.setLineDash([12, 8]);
    }

    solid() {
        this.context.setLineDash([]);
    }

    line(x1, y1, x2, y2, color, width) {
        this.context.beginPath();
        this.context.strokeStyle = color || 'black';
        this.context.lineWidth = width || 1;
        this.context.moveTo(this.xs(x1), this.ys(y1));
        this.context.lineTo(this.xs(x2), this.ys(y2));
        this.context.stroke();
    }

    point(x, y, color = '#f00', size = 2) {
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.fillStyle = color;
        this.context.lineWidth = 2;
        this.context.arc(this.xs(x), this.ys(y), size, 0, 2 * Math.PI);
        this.context.stroke();
        this.context.fill();
    }

    text(x, y, text, color = 'grey') {
        this.context.strokeStyle = color;
        this.context.lineWidth = 1;
        this.context.font = '12px Courier';
        this.context.strokeText(text, this.xs(x), this.ys(y));
    }

    angle(x, y, angle) {
        this.context.beginPath();
        this.context.strokeStyle = '#aaa';
        this.context.arc(this.xs(x), this.ys(y), 15, 0, angle, true);
        this.context.stroke();
    }

    polygon(points, color) {
        //console.log('polygon');
        this.context.fillStyle = color || '#FF800055';
        this.context.beginPath();
        this.context.moveTo(xs(points[0].x), ys(points[0].y));
        for (let i = 1; i < points.length; i++) {
            this.context.lineTo(this.xs(points[i].x), this.ys(points[i].y));
        }
        this.context.lineTo(this.xs(points[0].x), this.ys(points[0].y));
        this.context.closePath();
        this.context.fill();
    }
}
