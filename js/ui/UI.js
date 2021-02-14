const sin = x => Math.sin(x);
const arcsin = x => Math.asin(x);
const cos = x => Math.cos(x);
const tg = x => Math.tan(x);
const arctg = x => Math.atan(x);
const arccos = x => Math.acos(x);
const ln = x => Math.log(x);

class UI {
    constructor({ callbacks }) {
        this.callbacks = callbacks;
        document.getElementById('addFunction').addEventListener('click', () => this.addFunction());
        this.num = 0;
        document.getElementById('menu').addEventListener('click', () => this.createMenu());
    }

    createMenu() {
        const div = document.getElementById('big');
        div.classList.toggle('invisible');
        div.classList.toggle('visible');
        const start = Date.now();
        let timer = setInterval(() => {
            const timePassed = Date.now() - start;
            if (timePassed >= 210) {
                clearInterval(timer);
                return;
            }
            draw(timePassed);
        }, 15);
        const draw = timePassed => div.style.top = 30 + timePassed / 5 + 'px';
    };

    addFunction() {
        const input = document.createElement('input');
        input.setAttribute('placeholder', `функция №${this.num}`);
        input.addEventListener('keyup', () => this.keyup(input));
        input.dataset.num = this.num;

        const inputColor = document.createElement('input');
        inputColor.setAttribute('placeholder', 'цвет линии');
        inputColor.style.width = '120px';
        inputColor.addEventListener('keyup', () => this.keyupColor(inputColor));
        inputColor.dataset.num = this.num;

        const inputWidth = document.createElement('input');
        inputWidth.setAttribute('placeholder', 'ширина линии');
        inputWidth.style.width = '120px';
        inputWidth.addEventListener('keyup', () => this.keyupWidth(inputWidth));
        inputWidth.dataset.num = this.num;

        const inputDer = document.createElement('input');
        inputDer.setAttribute('type', 'checkbox');
        inputDer.setAttribute('id', `derivative${this.num}`);
        inputDer.addEventListener('change', () => this.checkDerivative(inputDer));
        inputDer.dataset.num = this.num;

        const labelDer = document.createElement('label');
        labelDer.setAttribute('for', `derivative${this.num}`);
        labelDer.innerHTML = 'Производная';
        labelDer.dataset.num = this.num;

        const inputX1 = document.createElement('input');
        inputX1.setAttribute('placeholder', 'левая асимптота');
        inputX1.addEventListener('keyup', () => this.keyupX1(inputX1));
        inputX1.dataset.num = this.num;

        const inputX2 = document.createElement('input');
        inputX2.setAttribute('placeholder', 'правая асимптота');
        inputX2.addEventListener('keyup', () => this.keyupX2(inputX2));
        inputX2.dataset.num = this.num;

        const inputConst = document.createElement('input');
        inputConst.setAttribute('type', 'checkbox');
        inputConst.setAttribute('id', `monotonicity${this.num}`);
        inputConst.addEventListener('change', () => this.checkConstancy(inputConst));
        inputConst.dataset.num = this.num;

        const labelConst = document.createElement('label');
        labelConst.setAttribute('for', `monotonicity${this.num}`);
        labelConst.innerHTML = 'Знакопостоянство';
        labelConst.dataset.num = this.num;

        let inputA = document.createElement('input');
        inputA.setAttribute('placeholder', 'a');
        inputA.addEventListener('keyup', () => this.keyupA(inputA));
        inputA.dataset.num = this.num;

        let inputB = document.createElement('input');
        inputB.setAttribute('placeholder', 'b');
        inputB.addEventListener('keyup', () => this.keyupB(inputB));
        inputB.dataset.num = this.num;

        let inputIntegral = document.createElement('input');
        inputIntegral.setAttribute('type', 'checkbox');
        inputIntegral.setAttribute('id', `integral${this.num}`);
        inputIntegral.addEventListener('change', () => this.checkIntegral(inputIntegral));
        inputIntegral.dataset.num = this.num;

        const labelIntegral = document.createElement('label');
        labelIntegral.setAttribute('for', `integral${this.num}`);
        labelIntegral.innerHTML = 'Интеграл';
        labelIntegral.dataset.num = this.num;

        const hr = document.createElement('hr');
        hr.style.width = '500px';

        const button = document.createElement('button');
        button.innerHTML = 'Удалить';
        button.style.marginLeft = '30px';
        button.addEventListener('click', () => {
            this.callbacks.delFunction(input.dataset.num);
            divFuncs.removeChild(input);
            divFuncs.removeChild(inputColor);
            divFuncs.removeChild(inputWidth);
            divFuncs.removeChild(inputDer);
            divFuncs.removeChild(labelDer);
            divFuncs.removeChild(inputX1);
            divFuncs.removeChild(inputX2);
            divFuncs.removeChild(inputConst);
            divFuncs.removeChild(labelConst);
            divFuncs.removeChild(inputA);
            divFuncs.removeChild(inputB);
            divFuncs.removeChild(inputIntegral);
            divFuncs.removeChild(labelIntegral);
            divFuncs.removeChild(button);
            divFuncs.removeChild(hr);
        });

        let divFuncs = document.getElementById('funcs');
        divFuncs.appendChild(input);
        divFuncs.appendChild(inputColor);
        divFuncs.appendChild(inputWidth);
        divFuncs.appendChild(inputDer);
        divFuncs.appendChild(labelDer);
        divFuncs.appendChild(inputX1);
        divFuncs.appendChild(inputX2);
        divFuncs.appendChild(inputConst);
        divFuncs.appendChild(labelConst);
        divFuncs.appendChild(inputA);
        divFuncs.appendChild(inputB);
        divFuncs.appendChild(inputIntegral);
        divFuncs.appendChild(labelIntegral);
        divFuncs.appendChild(button);
        divFuncs.appendChild(hr);
        this.num++;
    }

    keyup(elem) {
        try {
            let f;
            eval(`f=function(x) { return ${elem.value}; }`);
            this.callbacks.enterFunction(f, elem.dataset.num);
        } catch (e) {
            console.log(e);
        }
    }

    keyupColor(elem) {
        this.callbacks.enterColor(elem.value, elem.dataset.num);
    }

    keyupWidth(elem) {
        this.callbacks.enterWidth(elem.value, elem.dataset.num);
    }

    keyupX1(elem) {
        try {
            let x1;
            eval(`x1 = ${elem.value}`);
            this.callbacks.enterX1(x1, elem.dataset.num);
        } catch (e) {
            console.log(e);
        }
    }

    keyupX2(elem) {
        try {
            let x2;
            eval(`x2 = ${elem.value}`);
            this.callbacks.enterX2(x2, elem.dataset.num);
        } catch (e) {
            console.log(e);
        }
    }

    keyupA(elem) {
        try {
            let a;
            eval(`a = ${elem.value}`);
            this.callbacks.enterA(a, elem.dataset.num);
        } catch (e) {
            console.log(e);
        }
    }

    keyupB(elem) {
        try {
            let b;
            eval(`b = ${elem.value}`);
            this.callbacks.enterB(b, elem.dataset.num);
        } catch (e) {
            console.log(e);
        }
    }

    checkDerivative(elem) {
        this.callbacks.setDerivative(elem.checked, elem.dataset.num);
    }

    checkConstancy(elem) {
        this.callbacks.setConstancy(elem.checked, elem.dataset.num);
    }

    checkIntegral(elem) {
        this.callbacks.setIntegral(elem.checked, elem.dataset.num);
    }

}
