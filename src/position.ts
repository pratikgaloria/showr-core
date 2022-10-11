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
  protected _value: TradePositionType;

  constructor(value: TradePositionType) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  static update(
    oldPosition: TradePositionType,
    newPosition: TradePositionType
  ) {
    return newTradingPositionMap[oldPosition][newPosition];
  }
}
