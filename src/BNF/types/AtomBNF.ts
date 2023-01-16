import BaseBNF, { BNFType, TestResult, TestResultStatus } from "../BaseBNF";
import { Queue, Task } from "../Queue";

export default class AtomBNF<Name extends string> extends BaseBNF<Name> {
  type = BNFType.ATOM;
  #character: string;
  #isEpsilon = false;

  constructor(name: Name, character: string) {
    super(name);

    this.#character = character;
    this.#isEpsilon = this.#character.length === 0;
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
      run: async () => {
        const characterLength = this.character.length;

        const res = {
          children: [],
          range: {
            from: input.index,
            to: input.index + characterLength,
          },
          status:
            this.#isEpsilon || this.character === input.text[input.index]
              ? TestResultStatus.SUCCESS
              : TestResultStatus.FAILED,
          name: this.getName(),
          isToken: this.isToken(),
        };

        task.result = res;

        parentCallback(res, id);
      },
      callback: parent.callback,
      cancelled: false,
      ran: false,
    });

    queue.registerTask(task);

    return task;
  }

  get character() {
    return this.#character;
  }

  toDefinition(): string {
    return this.toVariable();
  }

  toVariable(): string {
    if (this.#isEpsilon) {
      return "ε";
    }

    if (!this.isToken()) {
      return `"${this.#character}"`;
    }

    return super.toVariable();
  }

  clone(): this {
    throw new Error("Method not implemented.");
  }
}
