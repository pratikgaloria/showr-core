export type PositionType = 'idle' | 'entry' | 'exit' | 'hold';

export const newPositionMap: {
  [currentPosition in PositionType]: {
    [newPosition in PositionType]: PositionType;
  };
} = {
  idle: {
    idle: 'idle',
    entry: 'entry',
    exit: 'idle',
    hold: 'idle',
  },
  entry: {
    idle: 'hold',
    entry: 'hold',
    exit: 'exit',
    hold: 'hold',
  },
  exit: {
    idle: 'idle',
    entry: 'entry',
    exit: 'idle',
    hold: 'idle',
  },
  hold: {
    idle: 'hold',
    entry: 'hold',
    exit: 'exit',
    hold: 'hold',
  },
};

export class Position {
  protected _type: PositionType;

  constructor(type: PositionType) {
    this._type = type;
  }

  get value() {
    return this._type;
  }

  update(newPosition?: PositionType) {
    this._type = newPositionMap[this._type][newPosition ?? this._type];

    return this;
  }
}
