import BaseBNF, { BNFType, TestResult, TestResultStatus } from "../BaseBNF";
import { Queue, Task } from "../Queue";

export default class OrBNF<
  Name extends string,
  Children extends BaseBNF<any, any[], any>[]
> extends BaseBNF<Name, Children> {
  type = BNFType.OR;

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
        const tasks = new Array<Task<TestResult<Name, any[]>>>();
        const symbols = new Array<Symbol>();
        const results = new Array<TestResult<Name, any[]> | undefined>();
        let done = false;

        const callback = (result: TestResult<Name, any[]>, _id: Symbol) => {
          if (done) {
            return;
          }

          const index = symbols.findIndex((symbol) => symbol === _id);

          if (index !== -1) {
            results[index] = result;
          }

          for (let i = 0; i < results.length && !done; i++) {
            const r = results[i];
            if (r === undefined) {
              break;
            } else {
              if (r.status === TestResultStatus.SUCCESS) {
                for (let j = i + 1; j < tasks.length; j++) {
                  tasks[j].cancelled = true;
                }

                done = true;

                const res = {
                  // @ts-ignore
                  children: [r],
                  range: {
                    from: input.index,
                    to: r.range.to,
                  },
                  status: TestResultStatus.SUCCESS,
                  name: this.getName(),
                  isToken: this.isToken(),
                  isHidden: this.isHidden(),
                } as unknown as TestResult<Name, any[]>;
                task.result = res;
                parentCallback(res, id);
              } else if (i === results.length - 1) {
                done = true;
                const res = {
                  // @ts-ignore
                  children: [],
                  range: {
                    from: input.index,
                    to: input.index,
                  },
                  status: TestResultStatus.FAILED,
                  name: this.getName(),
                  isToken: this.isToken(),
                  isHidden: this.isHidden(),
                };
                task.result = res;
                parentCallback(res, id);
              }
            }
          }
        };

        for (const bnf of this.children) {
          const symbol = Symbol();
          const childTask = bnf.evaluate(
            { ...input },
            queue,
            task,
            callback,
            symbol
          );

          tasks.push(childTask);
          symbols.push(symbol);
          results.push(undefined);
        }
      },
      callback: () => {},
      cancelled: false,
      ran: false,
    });

    queue.registerTask(task);

    return task;
  }

  OR(...bnf: BaseBNF<any, any[], any>[]) {
    this.children.push(...bnf);

    return this;
  }

  toDefinition(): string {
    return this.children.map((child) => child.toVariable()).join(" | ");
  }

  clone(): this {
    throw new Error("Method not implemented.");
  }
}
