import BaseBNF, { BNFType, TestResult, TestResultStatus } from "../BaseBNF";
import OrBNF from "./OrBNF";

export default class MinusBNF<
  Name extends string,
  BNF extends BaseBNF<any, any[], any>,
  Excluding extends BaseBNF<any, any[], any>[]
> extends BaseBNF<Name, [BNF]> {
  type = BNFType.OR;
  count = 0;

  #bnf;
  #excluding;

  constructor(name: Name, bnf: BNF, ...excluding: Excluding) {
    super(name, bnf);

    this.#bnf = bnf;
    this.#excluding = new OrBNF("", ...excluding);
  }

  _test(input: string, index: number = 0): TestResult<Name, [BNF]> {
    const result = this.#bnf._test(input, index);

    if (result.status === TestResultStatus.SUCCESS) {
      if (
        this.#excluding._test(input, index).status !== TestResultStatus.SUCCESS
      ) {
        return {
          // @ts-ignore
          children: [result],
          range: {
            from: index,
            to: result.range.to,
          },
          status: TestResultStatus.SUCCESS,
          name: this.getName(),
          isToken: this.isToken(),
        };
      }
    }

    return {
      // @ts-ignore
      children: [],
      range: {
        from: index,
        to: index,
      },
      status: TestResultStatus.FAILED,
      name: this.getName(),
      isToken: this.isToken(),
    };
  }

  toDefinition(): string {
    const excluding = this.#excluding.children;
    if (excluding.length > 0) {
      const excludingVariable =
        excluding.length > 1
          ? `(${this.#excluding.toDefinition()})`
          : this.#excluding.toDefinition();
      return `(${this.#bnf.toVariable()} - ${excludingVariable})`;
    } else {
      return this.#bnf.toVariable();
    }
  }

  clone(): this {
    throw new Error("Method not implemented.");
  }
}
