import BaseBNF, { BNFType, TestResult, TestResultStatus } from "../BaseBNF";
import { Queue, Task } from "../Queue";
import OrBNF from "./OrBNF";

export default class ExactMinusBNF<
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

  evaluate(
    input: {
      text: string;
      index: number;
    },
    queue: Queue<TestResult<Name, any[]>>,
    parent: Task<TestResult<Name, any[]>>,
    parentCallback: (result: TestResult<Name, any[]>, id: Symbol) => void,
    id: Symbol = Symbol()
  ) {
    const task = new Task({
      label: this.toTerminal(),
      parent,
      run: () => {
        const childInput = {
          ...input,
        };

        // @ts-ignore
        const results = [];

        const callback1 = (result: TestResult<Name, any[]>) => {
          const success =
            result.status !== TestResultStatus.SUCCESS ||
            // @ts-ignore
            results[0].range.to !== result.range.to;

          const res = {
            // @ts-ignore
            children: success ? [results[0]] : [],
            range: {
              from: input.index,
              // @ts-ignore
              to: success ? results[0].range.to : input.index,
            },
            status: success
              ? TestResultStatus.SUCCESS
              : TestResultStatus.FAILED,
            name: this.getName(),
            isToken: this.isToken(),
            isHidden: this.isHidden(),
          };

          task.result = res;

          parentCallback(res, id);
        };

        const callback0 = (result: TestResult<Name, any[]>) => {
          if (result.status === TestResultStatus.SUCCESS) {
            results.push(result);
            childInput.index = result.range.to;

            // @ts-ignore
            this.#excluding.evaluate({ ...input }, queue, task, callback1);
          } else {
            const res = {
              // @ts-ignore
              children: [],
              range: {
                from: input.index,
                to: childInput.index,
              },
              status: TestResultStatus.FAILED,
              name: this.getName(),
              isToken: this.isToken(),
              isHidden: this.isHidden(),
            };
            task.result = res;
            parentCallback(res, id);
          }
        };

        this.#bnf.evaluate(childInput, queue, task, callback0);
      },
      callback: () => {},
      cancelled: false,
      ran: false,
    });

    queue.registerTask(task);

    return task;
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
