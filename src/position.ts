export type PositionType = 'idle' | 'entry' | 'exit' | 'hold';

export class Position {
  protected _type: PositionType;

  constructor(type: PositionType) {
    this._type = type;
  }

  get value() {
    return this._type;
  }

  update(newPosition?: PositionType) {
    if (this._type === 'idle') {
      if (newPosition === 'entry') {
        this._type = 'entry';
      } else {
        this._type = 'idle';
      }
    } else if (this._type === 'entry' || this._type === 'hold') {
      if (newPosition === 'exit') {
        this._type = 'exit';
      } else {
        this._type = 'hold';
      }
    } else if (this._type === 'exit') {
      if (newPosition === 'entry') {
        this._type = 'entry';
      } else {
        this._type = 'idle';
      }
    }
  }
}
