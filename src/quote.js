class Quote {
  constructor(object) {
    this.value = object;

    if (object instanceof Array) {
      throw new Error('Array is not allowed as a Quote value. Please refer documentation of Quote.');
    }
  }
}

export default Quote;
