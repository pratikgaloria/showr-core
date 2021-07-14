/**
 * Creates a back-test report.
 */
export class BacktestReport {
  _currentCapital: number;

  profit: number;
  loss: number;
  numberOfTrades: number;
  initialCapital: number;
  finalCapital: number;
  returns: number;

  /**
   * Defines the initial capital for the back-test.
   * @param initialCapital - Initial capital for the back-test.
   */
  constructor(initialCapital: number) {
    this.profit = 0;
    this.loss = 0;
    this.numberOfTrades = 0;
    this.initialCapital = initialCapital;
    this.finalCapital = initialCapital;

    this.returns = 0;
    this._currentCapital = initialCapital;
  }

  private updateCapital(value: number) {
    this.finalCapital += value;
  }

  private updateTotals() {
    this.returns =
      ((this.finalCapital - this.initialCapital) * 100) / this.initialCapital;
    this.numberOfTrades += 1;
  }

  /**
   * Updates the capital according to the traded value after executing the entry position.
   * @param tradedValue - Traded value at the time.
   */
  markEntry(tradedValue: number) {
    this.updateCapital(-tradedValue);
  }

  /**
   * Updates the capital according to the traded value after executing the exit position.
   * @param tradedValue - Traded value at the time.
   */
  markExit(tradedValue: number) {
    this.updateCapital(tradedValue);

    if (this._currentCapital > this.finalCapital) {
      this.loss += this._currentCapital - this.finalCapital;
    } else {
      this.profit += this.finalCapital - this._currentCapital;
    }

    this._currentCapital = this.finalCapital;
    this.updateTotals();
  }
}
