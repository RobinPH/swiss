import { Queue, Task } from "./Queue";

export enum BNFType {
  ATOM = "ATOM",
  OR = "OR",
  CONCAT = "CONCAT",
  STAR = "STAR",
  PLUS = "PLUS",
  OPTIONAL = "OPTIONAL",
}

export enum TestResultStatus {
  PROCESSING = "PROCESSING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

type MakeTestResultChildren<
  Name extends string,
  Children extends BaseBNF<any, any[], any>[]
> = {
  [K in keyof Children]: Children[K] extends BaseBNF<Name>
    ? TestResult<
        Children[K] extends BaseBNF<infer V, any, Name> ? V : never,
        Children[K] extends BaseBNF<any, infer C, Name> ? C : never
      >
    : never;
};

export type TestResult<
  Name extends string,
  Children extends BaseBNF<any, any[], any>[]
> = {
  range: {
    from: number;
    to: number;
  };
  children: MakeTestResultChildren<Name, Children>;
  name: Name;
  status: TestResultStatus;
  isToken: boolean;
  isHidden: boolean;
};

abstract class BaseBNF<
  Name extends string,
  Children extends BaseBNF<any, any[], any>[] = [],
  Parent extends string = ""
> {
  abstract evaluate(
    input: {
      text: string;
      index: number;
    },
    queue: Queue<TestResult<Name, any[]>>,
    parent: Task<TestResult<Name, any[]>>,
    parentCallback: (result: TestResult<Name, any[]>, id: Symbol) => void,
    id?: Symbol
  ): Task<TestResult<Name, any[]>>;
  abstract clone(): ThisType<BaseBNF<Name>>;
  abstract toDefinition(): string;
  abstract type: BNFType;

  #children;
  #name: Name;
  #isToken = false;
  #parent?: Parent;
  #hide = false;

  constructor(name: Name, ...children: Children) {
    this.#name = name;
    this.#children = children;
  }

  async test(input: string) {
    return new Promise<
      TestResult<Name, any[]> & {
        input: string;
        task: Task<TestResult<Name, any[]>>;
      }
    >(async (resolve) => {
      const queue = new Queue<TestResult<Name, any[]>>();
      const task = new Task({
        // @ts-ignore
        run: async () => {},
        callback: () => {},
        depth: -1,
        cancelled: false,
        ran: false,
      }) as any;

      this.evaluate(
        {
          text: input,
          index: 0,
        },
        queue,
        task,
        (result) => {
          if (result.range.to !== input.length) {
            result.status = TestResultStatus.FAILED;
          }

          resolve({
            ...result,
            input,
            task,
          });
        }
      );

      queue.run();
    });
  }

  token() {
    this.#isToken = true;

    return this;
  }

  hide() {
    this.#hide = true;
    return this;
  }

  isName() {
    return this.#isToken;
  }

  name<NewValue extends string>(name: NewValue) {
    const me = this as unknown as BaseBNF<NewValue>;

    me.#name = name;

    return me;
  }

  toDeclaration() {
    return `${this.toTerminal()} ::= ${this.toDefinition()}`;
  }

  toTerminal() {
    return `<${this.getName()}>`;
  }

  toVariable() {
    return this.toTerminal();
  }

  getName() {
    return this.#name;
  }

  get children() {
    return this.#children;
  }

  isToken() {
    return this.#isToken;
  }

  isHidden() {
    return this.#hide;
  }
}

export default BaseBNF;
