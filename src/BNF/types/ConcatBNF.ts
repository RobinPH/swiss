import BaseBNF, { BNFType, TestResult, TestResultStatus } from "../BaseBNF";
import { Queue, Task } from "../Queue";

export default class ConcatBNF<
  Name extends string,
  Children extends BaseBNF<any, any[], any>[]
> extends BaseBNF<Name, Children> {
  type = BNFType.CONCAT;

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

        let fulfilledCount = 0;
        const tasks = new Array<Task<TestResult<Name, any[]>>>();

        // @ts-ignore
        const results = [];

        const newTask = (i: number) => {
          if (i >= this.children.length) {
            return;
          }

          const bnf = this.children[i];
          const childTask = bnf.evaluate(childInput, queue, task, callback);

          tasks.push(childTask);
        };

        let done = false;

        let i = 0;

        const callback = (result: TestResult<Name, any[]>) => {
          if (done) {
            return;
          }

          fulfilledCount++;

          if (result.status === TestResultStatus.SUCCESS) {
            results.push(result);
            childInput.index = result.range.to;
          } else {
            done = true;
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

          if (fulfilledCount === this.children.length) {
            const success = results.length === this.children.length;

            done = true;
            const res = {
              // @ts-ignore
              children: results,
              range: {
                from: input.index,
                to: childInput.index,
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
          }

          if (!done) {
            newTask(++i);
          }
        };

        newTask(i);
      },
      callback: () => {},
      cancelled: false,
      ran: false,
    });

    queue.registerTask(task);

    return task;
  }

  toDefinition(): string {
    return this.children.map((child) => child.toVariable()).join(" ");
  }

  clone(): ThisType<BaseBNF<Name>> {
    throw new Error("Method not implemented.");
  }
}
