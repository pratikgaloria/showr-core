import { Dataset, Indicator } from '../../src';
import { EnumSymbols } from '../../src/enums/symbols.enum';

interface IIndicatorParamsSMA {
  period?: number;
  attribute?: keyof typeof EnumSymbols | string;
}

export class SMA extends Indicator<IIndicatorParamsSMA> {
  constructor(name: string = 'SMA', params?: IIndicatorParamsSMA) {
    super(
      name,
      function(this: SMA, dataset: Dataset) {
        const attribute = this.params?.attribute || EnumSymbols.close;
        const period = this.params?.period || 5;

        const datasetLength = dataset.value.length;

        if (datasetLength < period) {
          return dataset.quotes[datasetLength - 1].getAttribute(attribute);
        }

        let total = 0;
        for (let i = datasetLength - period; i < datasetLength; i++) {
          total += dataset.quotes[i].getAttribute(attribute);
        }

        return total / period;
      },
      {
        params,
      }
    );
  }
}
