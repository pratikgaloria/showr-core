import { Indicator, IndicatorOptions } from '../indicator';
import { EnumSymbols } from '../enums/symbols';
interface IIndicatorOptionsMACD extends IndicatorOptions {
    name?: string;
    attribute?: keyof typeof EnumSymbols | string;
}
export declare class MACD extends Indicator {
    protected _options: IIndicatorOptionsMACD;
    constructor(options?: IIndicatorOptionsMACD);
}
export {};
