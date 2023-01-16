import AtomBNF from "./AtomBNF";
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
          // console.log("task", this.toTerminal(), bnf.toTerminal());
          const childTask = bnf.evaluate(childInput, queue, task, callback);

          tasks.push(childTask);
        };

        let done = false;

        let i = 0;

        const callback = (result: TestResult<Name, any[]>) => {
          if (done) {
            return;
          }

          // if (this.getName() === "ARITHMETIC_EXPRESSION") {
          //   console.log(this.toTerminal(), result.name, result);
          // }

          fulfilledCount++;
          // if (this.getName() === "ARITHMETIC_EXPRESSION") {
          //   console.log(this.toTerminal(), result, depth);
          // }

          if (result.status === TestResultStatus.SUCCESS) {
            results.push(result);
            childInput.index = result.range.to;
          } else {
            // for (const task of tasks) {
            //   task.cancelled = true;
            // }
            // for (let j = i + 1; j < tasks.length; j++) {
            //   tasks[j].cancelled = true;
            // }
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
            };
            task.result = res;
            parentCallback(res, id);
          }

          // console.log(
          //   this.toTerminal(),
          //   fulfilledCount,
          //   this.children.length,
          //   results.length === this.children.length
          // );

          if (fulfilledCount === this.children.length) {
            const success = results.length === this.children.length;
            // console.log(success, results.length, "dsad");

            done = true;
            const res = {
              // @ts-ignore
              children: success ? results : [],
              range: {
                from: input.index,
                to: childInput.index,
              },
              status: success
                ? TestResultStatus.SUCCESS
                : TestResultStatus.FAILED,
              name: this.getName(),
              isToken: this.isToken(),
            };

            task.result = res;
            parentCallback(res, id);
          }

          if (!done) {
            newTask(++i);
          }
        };

        newTask(i);

        // for (const bnf of this.children) {
        //   console.log("task", this.toTerminal(), bnf.toTerminal());
        //   const task = bnf.evaluate(childInput, queue, {
        //     callback,
        //     depth,
        //     ran: false,
        //   });

        //   tasks.push(task);
        // }
      },
      callback: (result) => {},
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
