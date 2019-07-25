class Indicator {
  constructor(name, options, execute) {
    this.name = name;
    this.options = options;
    this.execute = execute;
  }

  set(options) {
    this.options = {
      ...this.options,
      ...options,
    };

    return this;
  }
}

export default Indicator;
