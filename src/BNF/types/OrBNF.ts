import AtomBNF from "./AtomBNF";
import BaseBNF, { BNFType, TestResult, TestResultStatus } from "../BaseBNF";
import ManagerBNF from "../ManagerBNF";

export default class OrBNF<
  Name extends string,
  Children extends BaseBNF<any, any[], any>[]
> extends BaseBNF<Name, Children> {
  type = BNFType.OR;
  count = 0;

  _test(input: string, index: number = 0): TestResult<Name, Children> {
    // console.log(this.toTerminal());
    if (this.count <= 128) {
      this.count++;

      // console.log(this.children.map((c) => c.toTerminal()));

      for (const bnf of this.children) {
        const result = bnf._test(input, index);

        if (result.status === TestResultStatus.SUCCESS) {
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
    } else {
      // console.log(this.getName());
    }

    this.count = 0;

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

  OR(bnf: BaseBNF<any>) {
    this.children.push(bnf);

    return this;
  }

  toDefinition(): string {
    return this.children.map((child) => child.toVariable()).join(" | ");
  }

  clone(): this {
    throw new Error("Method not implemented.");
  }
}
