export type TradePositionType = 'idle' | 'entry' | 'exit' | 'hold';

export const newTradingPositionMap: {
  [currentTradingPosition in TradePositionType]: {
    [newTradingPosition in TradePositionType]: TradePositionType;
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

export class TradePosition {
  protected _type: TradePositionType;

  constructor(type: TradePositionType) {
    this._type = type;
  }

  get value() {
    return this._type;
  }

  update(newPosition?: TradePositionType) {
    this._type = newTradingPositionMap[this._type][newPosition ?? this._type];

    return this;
  }
}
