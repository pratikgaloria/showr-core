export class Algorithm {
  constructor(name, entry, exit) {
    this.name = name;
    this.entry = entry;
    this.exit = exit;
    this.hold = false;
  }

  execute(quote, dataset) {
    if (!this.hold && this.entry(quote, dataset)) {
      this.hold = true;
      return 'entry';
    }
    if (this.hold && this.exit(quote, dataset)) {
      this.hold = false;
      return 'exit';
    }

    return 'hold';
  }
}
