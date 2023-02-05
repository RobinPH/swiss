import { TestResult } from "../BNF/BaseBNF";
import { BaseData } from "./data/BaseData";

type MemoryJson = {
  data: Record<
    string,
    {
      type: string;
      identifier: string;
    }
  >;
  children: MemoryJson[];
};

export class MemoryError {
  constructor(
    public readonly range: { from: number; to: number },
    public readonly message: string
  ) {}
}

export class Memory {
  parent?: Memory;
  children = new Array<Memory>();
  data = new Map<string, BaseData<any>>();

  newChild() {
    const child = new Memory();

    child.parent = this;
    this.children.push(child);

    return child;
  }

  registerData(data: BaseData<any>, testResult?: TestResult<any, any[]>) {
    if (this.data.has(data.identifier)) {
      throw new MemoryError(
        testResult?.range ?? { from: 0, to: 0 },
        `Identifier "${data.identifier}" is already defined`
      );
    }

    this.data.set(data.identifier, data);
  }

  unregisterData(data: BaseData<any>) {
    this.data.delete(data.identifier);
  }

  hasData(identifier: string, checkParents = false): boolean {
    if (!checkParents) {
      return this.data.has(identifier);
    }

    let cur: Memory | undefined = this;
    let has = false;

    while (cur && !has) {
      has ||= cur.hasData(identifier, false);

      cur = cur.parent;
    }

    return has;
  }

  getData(identifier: string): BaseData<any> | undefined {
    let cur: Memory | undefined = this;

    while (cur) {
      if (cur.data.has(identifier)) {
        return cur.data.get(identifier);
      }

      cur = cur.parent;
    }
  }

  toJSON(): MemoryJson {
    const data = {} as Record<
      string,
      {
        type: string;
        identifier: string;
      }
    >;

    for (const [key, value] of this.data) {
      data[key] = value.toJSON();
    }

    return {
      data,
      children: this.children.map((child) => child.toJSON()),
    };
  }
}
