class Graph2D {
    constructor() {

        this.funcs = [];
        this.WINDOW = {
            LEFT: -10,
            BOTTOM: -10,
            WIDTH: 20,
            HEIGHT: 20
        };

        this.graph = new Graph({
            id: 'canvas',
            width: 600,
            height: 600,
            WINDOW: this.WINDOW,
            callbacks: {
                wheel: this.wheel,
                mouseup: this.mouseup,
                mousedown: this.mousedown,
                mouseleave: this.mouseleave,
                mousemove: this.mousemove
            }
        });

        this.ui = new UI({
            callbacks: {
                enterFunction: this.enterFunction,
                enterColor: this.enterColor,
                enterWidth: this.enterWidth,
                enterX1: this.enterX1,
                enterX2: this.enterX2,
                enterA: this.enterA,
                enterB: this.enterB,
                setDerivative: this.setDerivative,
                setConstancy: this.setConstancy,
                setIntegral: this.setIntegral,
                delFunction: this.delFunction
            }
        });

        this.zoomStep = 0.5;
        this.mouseX = 0;
        this.canScroll = false;
        this.zeroes = [];

        requestAnimationFrame(this.step);
    }

    /*******************/
    /* about callbacks */
    /*******************/

    wheel = (event) => {
        let delta = (event.wheelDelta > 0) ? -this.zoomStep : this.zoomStep;
        if (this.WINDOW.WIDTH - this.zoomStep > 0) {
            this.WINDOW.WIDTH += delta;
            this.WINDOW.HEIGHT += delta;
            this.WINDOW.LEFT -= delta / 2;
            this.WINDOW.BOTTOM -= delta / 2;
        }
    }

    mouseup = () => this.canScroll = false;
    mousedown = () => this.canScroll = true;
    mouseleave = () => this.canScroll = false;

    mousemove = (event) => {
        if (this.canScroll) {
            this.WINDOW.LEFT -= this.graph.sx(event.movementX);
            this.WINDOW.BOTTOM -= this.graph.sy(event.movementY);
        }
        this.mouseX = this.graph.sx(event.offsetX) + this.WINDOW.LEFT;
    }

    enterFunction = (f, num) => {
        if (this.funcs[num]) {
            this.funcs[num].f = f
        } else {
            this.funcs[num] = {
                f,
                color: '#aaa',
                width: 2,
                x1: -5,
                x2: 5,
                a: -1,
                b: 1
            };
        }
    }

    enterColor = (color, num) => this.funcs[num].color = color;
    enterWidth = (width, num) => this.funcs[num].width = width;

    enterX1 = (x1, num) => this.funcs[num].x1 = x1;
    enterX2 = (x2, num) => this.funcs[num].x2 = x2;

    enterA = (a, num) => this.funcs[num].a = a;
    enterB = (b, num) => this.funcs[num].b = b;

    setDerivative = (value, num) => {
        if (this.funcs[num]) {
            this.funcs[num].derivative = value;
        }
    }

    setConstancy = (value, num) => {
        if (this.funcs[num]) {
            this.funcs[num].constancy = value;
        }
    }

    setIntegral = (value, num) => {
        console.log('setIntegral');
        if (this.funcs[num]) {
            this.funcs[num].integral = value;
        }
    }

    delFunction = (num) => this.funcs[num] = null;

    /***************/
    /* about maths */
    /***************/
    getDerivative(f, x0) {
        const delX = 0.001;
        return (f(x0 + delX) - f(x0)) / delX;
    }

    getZeroes(x1, x2, f) {
        const dx = 0.01;
        if (x1 > x2) {
            const t = x1;
            x1 = x2;
            x2 = t;
        }
        let x = x1 - dx;
        let b = x2;
        while (x <= x2) {
            x += dx;
            if (f(x + dx) * f(x) < 0)
                this.zeroes.push(x);
            x1 = x;
            x2 = b;
        }
    }

    getCrossPoint(f, g) {
        const dx = 0.01;
        let a = this.WINDOW.LEFT;
        let x = a;
        let b = this.WINDOW.LEFT + this.WINDOW.WIDTH;
        while (x < b) {
            x += dx;
            if ((f(x) - g(x)) * (f(x + dx) - g(x + dx)) < 0)
                this.graph.point(x, f(x));
            a = x;
            b = this.WINDOW.LEFT + this.WINDOW.WIDTH;
        }
    }

    getIntegral(f, a, b) {
        console.log('getIntegral');
        const dx = (b - a) / 1000;
        let s = 0;
        let x = a;
        while (x <= b) {
            s += Math.abs((f(x) + f(x + dx)) / 2 * dx);
            x += dx;
        }
        return s;
    }

    /***************/
    /* about print */
    /***************/
    printOXY() {
        const x = this.WINDOW.LEFT;
        const y = this.WINDOW.BOTTOM;
        for (let i = 0; i < x + this.WINDOW.WIDTH; i++) {
            this.graph.line(i, y + this.WINDOW.HEIGHT, i, y, 'gainsboro', 1);
            this.graph.text(i + 0.1, 0.2, i);
            this.graph.line(i, 0.1, i, -0.1);
        }
        for (let i = -1; i > x; i -= 1) {
            this.graph.line(i, y + this.WINDOW.HEIGHT, i, y, 'gainsboro', 1);
            this.graph.text(i, 0.2, i);
            this.graph.line(i, 0.1, i, -0.1);
        }
        for (let i = 1; i < y + this.WINDOW.HEIGHT; i++) {
            this.graph.line(x, i, x + this.WINDOW.WIDTH, i, 'gainsboro', 1);
            this.graph.text(0.2, i + 0.1, i);
            this.graph.line(0.1, i, -0.1, i);
        }
        for (let i = -1; i > y; i -= 1) {
            this.graph.line(x, i, x + this.WINDOW.WIDTH, i, 'gainsboro', 1);
            this.graph.text(0.2, i + 0.1, i);
            this.graph.line(0.1, i, -0.1, i);
        }

        this.graph.line(0, 0, 0, y + this.WINDOW.HEIGHT, 'black', 1);    //ось у
        this.graph.line(0, y, 0, 0, 'black', 1);
        this.graph.line(0, 0, x + this.WINDOW.WIDTH, 0, 'black', 1);     //ось х
        this.graph.line(x, 0, 0, 0, 'black', 1);

        this.graph.line(- 0.1, y + this.WINDOW.HEIGHT - 0.4, 0, y + this.WINDOW.HEIGHT, 'black');   //стрелка у
        this.graph.line(0.1, y + this.WINDOW.HEIGHT - 0.4, 0, y + this.WINDOW.HEIGHT, 'black');

        this.graph.line(x + this.WINDOW.WIDTH - 0.4, - 0.1, x + this.WINDOW.WIDTH, 0, 'black');     //стрелка х
        this.graph.line(x + this.WINDOW.WIDTH - 0.4, 0.1, x + this.WINDOW.WIDTH, 0, 'black');
    }

    printFunction(f, color, width, x1 = this.WINDOW.LEFT, x2 = this.WINDOW.LEFT + this.WINDOW.WIDTH) {
        const dx = this.WINDOW.WIDTH / 300;
        if (x1 > x2) {
            const t = x1;
            x1 = x2;
            x2 = t;
        }
        while (x1 < x2) {
            try {
                this.graph.line(x1, f(x1), x1 + dx, f(x1 + dx), color, width);
            } catch (e) { }
            x1 += dx;
        }
    }

    printZeroes(x1, x2, f, color) {
        this.graph.dash();
        this.graph.line(x1, this.WINDOW.BOTTOM, x1, this.WINDOW.BOTTOM + this.WINDOW.HEIGHT, 'darkorange', 1);
        this.graph.line(x2, this.WINDOW.BOTTOM, x2, this.WINDOW.BOTTOM + this.WINDOW.HEIGHT, 'darkorange', 1);
        this.graph.solid();
        this.getZeroes(x1, x2, f);
        this.zeroes.forEach((item, i) => {
            this.graph.point(this.zeroes[i], 0, color);
        });
    }

    printDerivative(f, x0) {
        const der = this.getDerivative(f, x0);
        if (der) {
            const x1 = this.WINDOW.LEFT;
            const x2 = this.WINDOW.LEFT + this.WINDOW.WIDTH;
            this.graph.dash();
            this.graph.line(x1, der * (x1 - x0) + f(x0), x2, der * (x2 - x0) + f(x0), '#aaa', 1);
            this.graph.solid();
            this.graph.point(x0, f(x0), '#aaa');
            let angle;
            if (der >= 0) angle = 30 * Math.PI - Math.atan(der);
            if (der < 0) angle = 15 * Math.PI - Math.atan(der);
            this.graph.angle(x0 - f(x0) / der, 0, angle);
            this.graph.text(x0 - f(x0) / der + 0.3, -0.6, 'tg ɑ = ' + der.toFixed(3), '#aaa');
        }
    }

    printConstancy(f, x2, width) {
        for (let i = 0; i < (this.zeroes.length - 1); i += 2) {
            this.printFunction(f, 'darkorange', width, this.zeroes[i], this.zeroes[i + 1]);
        }
        if (this.zeroes.length % 2 === 1)
            this.printFunction(f, 'darkorange', width, this.zeroes[this.zeroes.length - 1], x2);
    }

    printIntegral(f, a, b) {
        //console.log('printIntegral');
        if (a > b) {
            const glass = a;
            a = b;
            b = glass;
        }
        if (!isNaN(a) && !isNaN(b) && a !== b) {
            let dx = (b - a) / 1000;
            let x = a;
            let points = [];
            points.push({ x: a, y: 0 });
            while (x <= b) {
                points.push({ x: x, y: f(x) });
                x += dx;
            }
            points.push({ x: b, y: 0 });
            //console.log(points);
            this.graph.polygon(points);
            let s = this.getIntegral(f, a, b);
            console.log(this.getIntegral);
            if (f((b - a) % 2) < 0)
                this.graph.text(a + 0.3, 0.6, 's = ' + s.toFixed(3), '#444');
            else
                this.graph.text(a + 0.3, -0.5, 's = ' + s.toFixed(3), '#444');
        }
    }

    render() {
        this.graph.clear();
        this.printOXY();
        this.funcs.forEach((func, i, arr) => {
            if (func) {
                try {
                    this.zeroes = [];
                    if (func.derivative) {
                        this.printDerivative(func.f, this.mouseX);
                    }
                    this.printFunction(func.f, func.color, func.width);

                    let color = `rgb(${30 + i * 60}, ${144 - i * 30}, ${255 - i * 30})`;
                    this.printFunction(func.f, color, func.width, func.x1, func.x2);
                    this.printZeroes(func.x1, func.x2, func.f, color);

                    if (i > 0) {
                        for (let j = 1; j < arr.length; j++)
                            this.getCrossPoint(arr[i - j].f, func.f);
                    }
                    if (func.constancy) {
                        this.printConstancy(func.f, func.x2, func.width);
                    }
                    if (func.integral) {
                        this.printIntegral(func.f, func.a, func.b);
                    }
                } catch (e) { }
            }
        });
    }

    step = () => {
        this.render();
        requestAnimationFrame(this.step);
    }
};