import { Indicator } from '../indicator';
import { EnumSymbols } from '../enums/symbols';
interface IIndicatorOptionsSMA {
    name?: string;
    period?: number;
    attribute?: keyof typeof EnumSymbols | string;
}
export declare class SMA extends Indicator {
    protected _options: IIndicatorOptionsSMA;
    constructor(options?: IIndicatorOptionsSMA);
}
export {};
