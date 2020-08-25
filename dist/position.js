"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = void 0;
class Position {
    constructor(type) {
        this._type = type;
    }
    get value() {
        return {
            position: this._type,
        };
    }
    update(newPosition) {
        if (this._type === 'idle') {
            if (newPosition === 'entry') {
                this._type = 'entry';
            }
            else {
                this._type = 'idle';
            }
        }
        else if (this._type === 'entry' || this._type === 'hold') {
            if (newPosition === 'exit') {
                this._type = 'exit';
            }
            else {
                this._type = 'hold';
            }
        }
        else if (this._type === 'exit') {
            if (newPosition === 'entry') {
                this._type = 'entry';
            }
            else {
                this._type = 'idle';
            }
        }
    }
}
exports.Position = Position;
