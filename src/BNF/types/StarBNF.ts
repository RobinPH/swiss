import BaseBNF, { BNFType, TestResult, TestResultStatus } from "../BaseBNF";
import { Queue, Task } from "../Queue";

export default class StarBNF<
  Name extends string,
  BNF extends BaseBNF<any, any[], any>
> extends BaseBNF<Name, BNF[]> {
  type = BNFType.STAR;

  #bnf;

  constructor(name: Name, bnf: BNF) {
    super(name, bnf);

    this.#bnf = bnf;
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

        const tasks = new Array<Task<TestResult<Name, any[]>>>();

        // @ts-ignore
        const results = [];

        const newTask = () => {
          const childTask = this.#bnf.evaluate(
            childInput,
            queue,
            task,
            callback
          );

          tasks.push(childTask);
        };

        let done = false;

        const previousIndex = new Map<number, number>();
        const getIndex = (index: number) => {
          return previousIndex.get(index) ?? 0;
        };

        const addIndex = (index: number) => {
          previousIndex.set(index, getIndex(index) + 1);
        };

        const callback = (result: TestResult<Name, any[]>) => {
          if (done) {
            return;
          }

          const isLoop = getIndex(childInput.index) > 2;

          addIndex(childInput.index);

          if (result.status === TestResultStatus.SUCCESS && !isLoop) {
            results.push(result);
            childInput.index = result.range.to;
            newTask();
          } else {
            done = true;
            const res = {
              // @ts-ignore
              children: results,
              range: {
                from: input.index,
                to: childInput.index,
              },
              status: TestResultStatus.SUCCESS,
              name: this.getName(),
              isToken: this.isToken(),
              isHidden: this.isHidden(),
            };
            task.result = res;

            parentCallback(res, id);
          }
        };

        newTask();
      },
      callback: () => {},
      cancelled: false,
      ran: false,
    });

    queue.registerTask(task);

    return task;
  }

  toVariable(): string {
    return `${this.#bnf.toTerminal()}*`;
  }

  toDefinition(): string {
    const definition =
      this.#bnf.children.length > 1
        ? `(${this.#bnf.toDefinition()})`
        : this.#bnf.toDefinition();

    return `${definition}*`;
  }

  clone(): ThisType<BaseBNF<Name>> {
    throw new Error("Method not implemented.");
  }

  bnf() {
    return this.#bnf;
  }
}
