import AtomBNF from "./AtomBNF";
import BaseBNF, { BNFType, TestResult, TestResultStatus } from "../BaseBNF";
import ManagerBNF from "../ManagerBNF";
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
    // console.log(input.index);
    const task = new Task({
      label: this.toTerminal(),
      parent,
      run: () => {
        let fulfilledCount = 0;
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

          let unfulfilledCount = 0;

          for (const res of results) {
            if (res === undefined) {
              unfulfilledCount++;
            }
          }

          // if (result.status === TestResultStatus.SUCCESS) {
          //   const res = {
          //     // @ts-ignore
          //     children: [best],
          //     range: {
          //       from: input.index,
          //       to: result.range.to,
          //     },
          //     status: TestResultStatus.SUCCESS,
          //     name: this.getName(),
          //     isToken: this.isToken(),
          //   } as unknown as TestResult<Name, any[]>;
          //   task.result = res;
          //   parentCallback(res, id);
          // } else {
          //   if (unfulfilledCount === 0) {
          //     const res = {
          //       // @ts-ignore
          //       children: [],
          //       range: {
          //         from: input.index,
          //         to: input.index,
          //       },
          //       status: TestResultStatus.FAILED,
          //       name: this.getName(),
          //       isToken: this.isToken(),
          //     };
          //     task.result = res;
          //     parentCallback(res, id);
          //   }
          // }

          // console.log(unfulfilledCount, results.length);
          // if (unfulfilledCount === 0) {
          //   done = true;
          //   const successes = results.filter(
          //     (res) => res?.status === TestResultStatus.SUCCESS
          //   );

          //   if (successes.length > 0) {
          //     const best = successes.sort(
          //       (a, b) => b!.range.to - a!.range.to
          //     )[0]!;

          //     const res = {
          //       // @ts-ignore
          //       children: [best],
          //       range: {
          //         from: input.index,
          //         to: best.range.to,
          //       },
          //       status: TestResultStatus.SUCCESS,
          //       name: this.getName(),
          //       isToken: this.isToken(),
          //     } as unknown as TestResult<Name, any[]>;
          //     task.result = res;
          //     parentCallback(res, id);
          //   } else {
          //     const res = {
          //       // @ts-ignore
          //       children: [],
          //       range: {
          //         from: input.index,
          //         to: input.index,
          //       },
          //       status: TestResultStatus.FAILED,
          //       name: this.getName(),
          //       isToken: this.isToken(),
          //     };
          //     task.result = res;
          //     parentCallback(res, id);
          //   }
          // }

          for (let i = 0; i < results.length && !done; i++) {
            const r = results[i];
            if (r === undefined) {
              break;
            } else {
              if (r.status === TestResultStatus.SUCCESS) {
                // console.log("SUCCESS", this.toTerminal());
                // for (const task of tasks) {
                //   task.cancelled = true;
                // }
                for (let j = i + 1; j < tasks.length; j++) {
                  tasks[j].cancelled = true;
                }

                done = true;
                // console.log(result.name);

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
          // console.log(this.toTerminal(), tasks.length);
        }
      },
      callback: (result) => {},
      cancelled: false,
      ran: false,
    });

    queue.registerTask(task);

    return task;
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
