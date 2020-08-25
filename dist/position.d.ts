export declare type PositionType = 'idle' | 'entry' | 'exit' | 'hold';
export declare class Position {
    protected _type: PositionType;
    constructor(type: PositionType);
    get value(): {
        position: PositionType;
    };
    update(newPosition?: PositionType): void;
}
