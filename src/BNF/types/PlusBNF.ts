import AtomBNF from "./AtomBNF";
import BaseBNF, { BNFType, TestResult, TestResultStatus } from "../BaseBNF";

export default class PlusBNF<
  Name extends string,
  BNF extends BaseBNF<any, any[], any>
> extends BaseBNF<Name, BNF[]> {
  type = BNFType.PLUS;
  #bnf;

  constructor(name: Name, bnf: BNF) {
    super(name, bnf);

    this.#bnf = bnf;
  }

  _test(input: string, index: number = 0): TestResult<Name, BNF[]> {
    let currentIndex = index;
    const results = [];

    while (true) {
      const result = this.#bnf._test(input, currentIndex);

      if (result.status === TestResultStatus.SUCCESS) {
        currentIndex = result.range.to;
        results.push(result);
      } else {
        break;
      }
    }

    const success = results.length > 0;

    return {
      // @ts-ignore
      children: success ? results : [],
      range: {
        from: index,
        to: currentIndex,
      },
      status: success ? TestResultStatus.SUCCESS : TestResultStatus.FAILED,
      name: this.getName(),
      isToken: this.isToken(),
    };
  }

  toVariable(): string {
    return `${this.#bnf.toTerminal()}+`;
  }

  toDefinition(): string {
    const definition =
      this.#bnf.children.length > 1
        ? `(${this.#bnf.toDefinition()})`
        : this.#bnf.toDefinition();

    return `${definition}+`;
  }

  clone(): ThisType<BaseBNF<Name>> {
    throw new Error("Method not implemented.");
  }

  bnf() {
    return this.#bnf;
  }
}
