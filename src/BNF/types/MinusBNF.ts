import BaseBNF, { BNFType, TestResult, TestResultStatus } from "../BaseBNF";

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
    this.#excluding = excluding;
  }

  _test(input: string, index: number = 0): TestResult<Name, [BNF]> {
    const result = this.#bnf._test(input, index);

    if (result.status === TestResultStatus.SUCCESS) {
      let excludedMatched = false;

      for (let i = 0; i < this.#excluding.length && !excludedMatched; i++) {
        const res = this.#excluding[i]._test(input, index);

        excludedMatched ||= res.status === TestResultStatus.SUCCESS;
      }

      if (!excludedMatched) {
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
    return this.children.map((child) => child.toVariable()).join(" | ");
  }

  clone(): this {
    throw new Error("Method not implemented.");
  }
}
