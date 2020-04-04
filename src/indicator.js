export class Indicator {
  constructor(name, options, calculate) {
    this.name = name;
    this.options = options;
    this.calculate = calculate;
  }

  set(options) {
    this.options = {
      ...this.options,
      ...options,
    };

    return this;
  }
}
