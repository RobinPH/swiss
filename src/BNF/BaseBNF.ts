import { Memory } from "../SyntaxAnalyzer/Memory";
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
  memory?: Memory;
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

            result.children.push({
              // @ts-ignore
              children: [],
              range: {
                from: result.range.to,
                to: input.length,
              },
              status: TestResultStatus.FAILED,
              name: "INVALID_LEXEME",
              isToken: true,
              isHidden: false,
            });
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
    if (this.isNameUUID()) {
      return "(" + this.toDefinition() + ")";
    }

    return this.toTerminal();
  }

  isNameUUID() {
    const regex =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

    return regex.test(this.getName());
  }

  getAllDeclaration() {
    const children = new Array<BaseBNF<any, any[], any>>();
    const has = new Set<BaseBNF<any, any[], any>>();

    const getChildren = (bnf: BaseBNF<any, any[], any>) => {
      if (has.has(bnf)) {
        return;
      }

      has.add(bnf);
      if (!bnf.isNameUUID() && bnf.type !== BNFType.ATOM) {
        children.push(bnf);
      }

      for (const child of bnf.#children) {
        getChildren(child);
      }
    };

    getChildren(this);

    children.reverse();

    const declarations = new Array<string>();

    for (const bnf of children) {
      const declaration = bnf.toDeclaration();

      declarations.push(declaration.replace("\r", "\\r").replace("\n", "\\n"));
    }

    return declarations;
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
