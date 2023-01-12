import BaseBNF, { BNFType, TestResult, TestResultStatus } from "../BaseBNF";

export default class AtomBNF<Name extends string> extends BaseBNF<Name> {
  type = BNFType.ATOM;
  #character: string;
  #isEpsilon = false;

  constructor(name: Name, character: string) {
    super(name);

    this.#character = character;
    this.#isEpsilon = this.#character.length === 0;
  }

  _test(input: string, index: number = 0): TestResult<Name, []> {
    const characterLength = this.character.length;

    return {
      children: [],
      range: {
        from: index,
        to: index + characterLength,
      },
      status:
        this.#isEpsilon || this.character === input[index]
          ? TestResultStatus.SUCCESS
          : TestResultStatus.FAILED,
      name: this.getName(),
      isToken: this.isToken(),
    };
  }

  get character() {
    return this.#character;
  }

  toDefinition(): string {
    return this.toVariable();
  }

  toVariable(): string {
    if (this.#isEpsilon) {
      return "ε";
    }

    if (!this.isToken()) {
      return `"${this.#character}"`;
    }

    return super.toVariable();
  }

  clone(): this {
    throw new Error("Method not implemented.");
  }
}
