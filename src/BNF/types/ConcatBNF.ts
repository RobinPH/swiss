import AtomBNF from "./AtomBNF";
import BaseBNF, { BNFType, TestResult, TestResultStatus } from "../BaseBNF";

export default class ConcatBNF<
  Name extends string,
  Children extends BaseBNF<any, any[], any>[]
> extends BaseBNF<Name, Children> {
  type = BNFType.CONCAT;

  _test(input: string, index: number = 0): TestResult<Name, Children> {
    const results = [];
    let currentIndex = index;

    for (const bnf of this.children) {
      const result = bnf._test(input, currentIndex);

      currentIndex = result.range.to;

      if (result.status === TestResultStatus.SUCCESS) {
        results.push(result);
      } else {
        break;
      }
    }

    const success = results.length === this.children.length;

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

  toDefinition(): string {
    return this.children.map((child) => child.toVariable()).join(" ");
  }

  clone(): ThisType<BaseBNF<Name>> {
    throw new Error("Method not implemented.");
  }
}
