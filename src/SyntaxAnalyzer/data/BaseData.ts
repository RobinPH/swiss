export abstract class BaseData<Value> {
  readonly type: string;
  readonly rawValue: string;
  readonly identifier: string;
  #value?: Value;

  abstract parseValue(rawValue: string): Value;

  constructor(type: string, identifier: string, rawValue: string) {
    this.type = type;
    this.identifier = identifier;
    this.rawValue = rawValue;
  }

  get value() {
    if (this.#value) {
      return this.#value;
    }

    const value = this.parseValue(this.rawValue);

    return (this.#value = value);
  }

  toJSON() {
    return {
      type: this.type,
      identifier: this.identifier,
    };
  }
}
