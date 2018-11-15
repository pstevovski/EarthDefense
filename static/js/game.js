const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const cWidth = canvas.width;
const cHeight = canvas.height;
const minHeight = 0;
const maxHeight = 500;

export class Game {
    constructor() {
        this.width = cWidth;
        this.height = cHeight;
        this.minHeight = 0;
        this.maxHeight = 500;
    }
}

const game = new Game();