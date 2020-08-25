import { Indicator } from '../indicator';
import { EnumSymbols } from '../enums/symbols';
interface IIndicatorOptionsEMA {
    name?: string;
    period?: number;
    attribute?: keyof typeof EnumSymbols | string;
}
export declare class EMA extends Indicator {
    protected _options: IIndicatorOptionsEMA;
    constructor(options?: IIndicatorOptionsEMA);
}
export {};
