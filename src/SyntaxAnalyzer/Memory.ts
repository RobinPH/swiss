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

  registerData(data: BaseData<any>) {
    if (this.data.has(data.identifier)) {
      throw new Error(`Identifier "${data.identifier}" is already defined`);
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
