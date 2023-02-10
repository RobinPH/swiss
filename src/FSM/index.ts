import { v4 as uuidv4 } from "uuid";
import { Queue } from "@datastructures-js/queue";

let index = 0;

export enum FiniteStateMachineType {
  E_NFA = 3,
  NFA = 2,
  DFA = 1,
}

let id = 0;

const makeId = () => {
  // return uuidv4();
  return `${id++}`;
};

const ValueMapping = new Map<string, string | undefined>();

export type Result = {
  id: string;
  range: {
    from: number;
    to: number;
  };
  children: Result[];
  value?: string;
  name: string;
  isToken: boolean;
  input: string;
};

export class FiniteStateMachine<Value extends string = string> {
  static readonly EPSILON = "ε";

  readonly id = uuidv4();
  #_id = makeId();

  startIds: string[] = [];
  endIds = [this.#_id];

  #value?: Value;
  index = index++;
  #name?: any;
  #isToken = false;
  #isHidden = false;

  // name(name: string) {
  //   return this.#name ?? `q${this.index}`;
  // }

  isFinalState: boolean = false;

  start: FiniteStateMachine[] = [this];
  end: FiniteStateMachine = this;

  transitions = new Map<string, FiniteStateMachine[]>();

  private constructor(value?: Value) {
    this.value(value);
  }

  name(name: string) {
    this.#name = name;

    return this;
  }

  getName() {
    return this.#name ?? `q${this.index}`;
  }

  hide() {
    this.#isHidden = true;

    return this;
  }

  token() {
    this.#isToken = true;

    return this;
  }

  value(value: Value | undefined) {
    ValueMapping.set(this.#_id, value);
    this.#value = value;

    return this;
  }

  getValue() {
    return this.#value;
  }

  static ATOM(symbol: string) {
    const { fsm, end } = FiniteStateMachine.makeStartAndEnd();

    fsm.addTransition({
      symbol,
      machine: end,
    });

    return fsm;
  }

  static OR(...machines: FiniteStateMachine[]) {
    const { fsm, end } = FiniteStateMachine.makeStartAndEnd();

    for (const machine of machines) {
      const clone = FiniteStateMachine.clone(machine);

      fsm.addTransition({
        machine: clone,
      });

      clone.end.addTransition({
        machine: end,
      });
    }

    return fsm;
  }

  static CONCAT(...machines: FiniteStateMachine[]) {
    const { fsm, end } = FiniteStateMachine.makeStartAndEnd();

    let current: FiniteStateMachine = fsm;

    for (const machine of machines) {
      const clone = FiniteStateMachine.clone(machine);

      current.addTransition({
        machine: clone,
      });

      current = clone.end;
    }

    current.addTransition({ machine: end });

    return fsm;
  }

  static STAR(machine: FiniteStateMachine) {
    const { fsm, end } = FiniteStateMachine.makeStartAndEnd();

    const clone = FiniteStateMachine.clone(machine);

    fsm.addTransition({
      machine: clone,
    });

    clone.end.addTransition({
      machine: clone,
    });

    clone.end.addTransition({
      machine: end,
    });

    fsm.addTransition({
      machine: end,
    });

    return fsm;
  }

  static PLUS(machine: FiniteStateMachine) {
    const clone = FiniteStateMachine.clone(machine);

    const star = FiniteStateMachine.STAR(machine);

    return FiniteStateMachine.CONCAT(clone, star);
  }

  static WORD(word: string) {
    const atoms = word.split("").map((c) => FiniteStateMachine.ATOM(c));

    return FiniteStateMachine.CONCAT(...atoms);
  }

  static OPTIONAL(machine: FiniteStateMachine) {
    const clone = FiniteStateMachine.clone(machine);
    const epsilon = FiniteStateMachine.ATOM(FiniteStateMachine.EPSILON);

    return FiniteStateMachine.OR(clone, epsilon);
  }

  test(input: string) {
    // let machine: FiniteStateMachine = this;
    let machine = this.toDFA();

    const stack = new Array<string>();

    const startIdx = new Map<string, number>();
    const endIdx = new Map<string, number>();

    const push = (machine: FiniteStateMachine) => {
      stack.push(...machine.startIds);
    };

    const pop = (machine: FiniteStateMachine) => {
      for (const id of [...machine.endIds].reverse()) {
        // console.log(stack[stack.length - 1], id);
        if (stack[stack.length - 1] === id) {
          // console.log("foooo");
          stack.pop();
        }
      }
    };

    const assign = (id: string, idx: number) => {
      if (!startIdx.has(id)) {
        startIdx.set(id, idx);

        return undefined;
      }

      return startIdx.get(id)!;
    };

    // console.log(machine.startIds);
    // console.log(machine.endIds);

    const foo = (machine: FiniteStateMachine, i: number) => {
      const froms = new Array<{
        value?: string;
        id: string;
        index: number;
      }>();

      const tos = new Array<{
        value?: string;
        id: string;
        index: number;
      }>();

      const _ids = [...machine.startIds, ...machine.endIds];

      const ids = new Array<string>();

      for (const id of _ids) {
        if (ids.indexOf(id) === -1) {
          ids.push(id);
        }
      }

      ids.reverse();

      console.log(ids);

      for (const id of ids) {
        const existingIdx = assign(id, i);

        if (existingIdx !== undefined) {
          froms.push({
            value: ValueMapping.get(id),
            id,
            index: i,
          });
        } else {
          tos.push({
            value: ValueMapping.get(id),
            id,
            index: i,
          });
        }
      }

      tos.reverse();

      return { froms, tos };
    };

    let cc: string | undefined;

    const results = new Array<Result>();

    results.push({
      children: [],
      id: "-1",
      range: {
        from: 0,
        to: 0,
      },
      name: "foo",
      isToken: false,
      input: "---",
    });

    const process = (
      cc: string | undefined,
      machine: FiniteStateMachine,
      i: number
    ) => {
      const { froms, tos } = foo(machine, i);

      if (cc) {
        for (const from of froms) {
          console.log(from, "from");

          while (results.length && results[results.length - 1].id !== from.id) {
            results.pop();
          }

          const last = results.pop();

          if (!!last) {
            last.range.to = from.index;
            last.input = input.slice(last.range.from, last.range.to);

            if (results.length > 0) {
              results[results.length - 1].children.push(last);
            }
          }
        }
      }
      for (const to of tos) {
        console.log(to, "to");

        results.push({
          id: to.id,
          children: [],
          range: {
            from: to.index,
            to: 0,
          },
          value: to.value,
          name: to.value ?? "foo",
          isToken: false,
          input: "",
        });
      }
    };

    for (let i = 0; i < input.length; i++) {
      const c = input[i];

      if (machine.transitions.has(c)) {
        process(cc, machine, i);

        machine = machine.transitions.get(c)![0];
      } else {
        return false;
      }

      cc = c;
    }

    process(cc, machine, input.length);

    const merge = (result: Result, results: Result[]) => {};

    console.log(results[0].children);
    // pop(machine);

    // console.log(machine.name, machine.values, machine.start.length);

    // console.log(stack);

    // return machine.isFinalState;
    return results[0].children[0];
  }

  toNFA() {
    const { machines, symbols, type } = this.getInfo();
    // console.log("x");

    // console.log(machines.size);

    if (type <= FiniteStateMachineType.NFA) {
      return this;
    }

    const checkingSymbols = Array.from(symbols).filter(
      (symbol) => symbol !== FiniteStateMachine.EPSILON
    );

    const { get } = FiniteStateMachine.something({
      key: (machines: FiniteStateMachine[]) => {
        return machines
          .sort()
          .map((machine) => machine.id)
          .join("+");
      },
      sort: (a, b) => a.index - b.index,
    });

    for (const machine of machines) {
      get([machine]);
    }

    for (const machine of machines) {
      const newMachine = get([machine]);

      for (const eReachable of FiniteStateMachine.eClosure([machine])) {
        newMachine.isFinalState ||= eReachable.isFinalState;
        newMachine.startIds.push(...eReachable.startIds);
        newMachine.endIds.push(...eReachable.endIds);
      }

      for (const symbol of checkingSymbols) {
        const a = FiniteStateMachine.transition(FiniteStateMachine.EPSILON, [
          machine,
        ]);
        const b = FiniteStateMachine.transition(symbol, a);
        const c = FiniteStateMachine.eClosure(b);

        const newChildren = c;

        for (const newChild of newChildren) {
          newMachine.addTransition({
            symbol,
            machine: get([newChild]),
          });
        }
      }
    }

    return get([this]);
  }

  toDFA(): FiniteStateMachine<string> {
    const { machines, symbols, type } = this.getInfo();

    if (type === FiniteStateMachineType.DFA) {
      return this;
    }

    if (type === FiniteStateMachineType.E_NFA) {
      return this.toNFA().toDFA();
    }

    const { get } = FiniteStateMachine.something({
      key: (machines: FiniteStateMachine[]) => {
        return machines
          .sort()
          .map((machine) => machine.id)
          .join("+");
      },
      sort: (a, b) => a.index - b.index,
    });

    const queue = new Queue<FiniteStateMachine[]>();
    const done = new Set<FiniteStateMachine>();

    queue.push([this]);

    while (!queue.isEmpty()) {
      const machines = queue.dequeue();

      if (machines.length === 0) {
        continue;
      }

      const newMachine = get(machines);

      // console.log(machines.map((machine) => machine.name).join("+"), "x");

      if (done.has(newMachine)) {
        continue;
      }

      done.add(newMachine);

      for (const machine of machines) {
        newMachine.isFinalState ||= machine.isFinalState;
      }

      for (const symbol of symbols) {
        const children = Array.from(
          FiniteStateMachine.transition(symbol, machines)
        );

        if (children.length > 0) {
          const newChild = get(children);

          queue.enqueue(children);

          newMachine.addTransition({
            symbol,
            machine: newChild,
          });
        }
      }
    }

    return get([this])!;
  }

  getInfo(done = new Set<FiniteStateMachine>()) {
    const states = new Set<FiniteStateMachine>();
    const symbols = new Set<string>();

    let type: FiniteStateMachineType = FiniteStateMachineType.DFA;

    if (!done.has(this)) {
      done.add(this);
      states.add(this);

      for (const [symbol, machines] of this.transitions.entries()) {
        symbols.add(symbol);

        if (machines.length > 1) {
          type = Math.max(type, FiniteStateMachineType.NFA);
        }

        if (symbol === FiniteStateMachine.EPSILON) {
          type = Math.max(type, FiniteStateMachineType.E_NFA);
        }

        for (const machine of machines) {
          states.add(machine);
          const subInfo = machine.getInfo(done);

          type = Math.max(type, subInfo.type);

          for (const subState of subInfo.machines) {
            states.add(subState);
          }

          for (const subSymbol of subInfo.symbols) {
            symbols.add(subSymbol);
          }
        }
      }
    }

    return {
      machines: states,
      symbols,
      type,
    };
  }

  private static eClosureCache = new Map<string, Set<FiniteStateMachine>>();

  private static eClosure(machines: Iterable<FiniteStateMachine>) {
    let idx = "";
    for (const machine of machines) {
      idx += machine.id;
    }
    // machines.sort((a, b) => a.index - b.index);
    // const idx = machines.map((machine) => machine.id).join("+");

    let doSet = false;

    if (FiniteStateMachine.eClosureCache.has(idx)) {
      return FiniteStateMachine.eClosureCache.get(idx)!;
    } else {
      doSet = true;
    }

    const result = new Set<FiniteStateMachine>();

    for (const machine of machines) {
      result.add(machine);

      const rawChildren =
        machine.transitions.get(FiniteStateMachine.EPSILON) ?? [];

      const children = rawChildren.filter((child) => !result.has(child));

      const subResults = FiniteStateMachine.eClosure(children);

      for (const subResult of subResults) {
        result.add(subResult);
      }
    }

    if (doSet) {
      FiniteStateMachine.eClosureCache.set(idx, result);
    }

    return result;
  }

  private static transitionCache = new Map<string, Set<FiniteStateMachine>>();

  private static transition(
    symbol: string,
    machines: Iterable<FiniteStateMachine>
  ) {
    // let idx = symbol;
    // for (const machine of machines) {
    //   idx += machine.id;
    // }
    // machines.sort((a, b) => a.index - b.index);
    // const idx = symbol + machines.map((machine) => machine.id).join("+");

    // let doSet = false;

    // if (FiniteStateMachine.transitionCache.has(idx)) {
    //   return FiniteStateMachine.transitionCache.get(idx)!;
    // } else {
    //   doSet = true;
    // }

    if (symbol === FiniteStateMachine.EPSILON) {
      return FiniteStateMachine.eClosure(machines);
    }

    const result = new Set<FiniteStateMachine>();

    for (const machine of machines) {
      for (const child of machine.transitions.get(symbol) ?? []) {
        result.add(child);
      }
    }

    // if (doSet) {
    //   FiniteStateMachine.transitionCache.set(idx, result);
    // }

    return result;
  }

  addTransition(args: { symbol?: string; machine: FiniteStateMachine }) {
    const symbol = args.symbol ?? FiniteStateMachine.EPSILON;

    if (!this.transitions.has(symbol)) {
      this.transitions.set(symbol, []);
    }

    this.transitions.get(symbol)!.push(args.machine);
  }

  final() {
    this.isFinalState = true;
  }

  private static makeStartAndEnd<T extends string>(value?: T) {
    const fsm = value ? new FiniteStateMachine<T>() : new FiniteStateMachine();
    const end = value
      ? new FiniteStateMachine(value)
      : new FiniteStateMachine();

    fsm.end = end;
    end.start = [fsm];
    fsm.endIds = end.endIds;
    end.startIds = fsm.startIds;

    const tmp = end.startIds;
    end.startIds = end.endIds;
    end.endIds = tmp;

    if (value) {
      end.isFinalState = true;
    }

    return {
      fsm,
      end,
    };
  }

  private clone() {
    if (FiniteStateMachine.cloneInitiator === undefined) {
      FiniteStateMachine.cloneInitiator = this;
    }

    const clone = new FiniteStateMachine(this.getValue());
    FiniteStateMachine.cloneStash.set(this.id, clone);

    clone.isFinalState = this.isFinalState;
    clone.end = FiniteStateMachine.clone(this.end);
    clone.startIds = [...this.startIds];
    clone.endIds = [...this.endIds];

    for (const [symbol, machines] of this.transitions) {
      for (const machine of machines) {
        clone.addTransition({
          symbol,
          machine: FiniteStateMachine.clone(machine),
        });
      }
    }

    if (FiniteStateMachine.cloneInitiator === this) {
      FiniteStateMachine.cloneInitiator = undefined;
      FiniteStateMachine.cloneStash.clear();
    }

    return clone;
  }

  private static cloneStash = new Map<string, FiniteStateMachine>();
  private static cloneInitiator: FiniteStateMachine | undefined;

  private static clone(machine: FiniteStateMachine) {
    if (FiniteStateMachine.cloneStash.has(machine.id)) {
      return FiniteStateMachine.cloneStash.get(machine.id)!;
    }

    return machine.clone();
  }

  private static something<Key extends any>(args: {
    key: (machines: FiniteStateMachine[]) => Key;
    sort?: (a: FiniteStateMachine, b: FiniteStateMachine) => number;
  }) {
    const mapping = new Map<Key, FiniteStateMachine>();

    const sort = args.sort ?? ((a, b) => a.index - b.index);

    const get = (machines: FiniteStateMachine[]) => {
      machines.sort(sort);

      const key = args.key(machines);

      if (!mapping.has(key)) {
        const newMachine = new FiniteStateMachine();
        mapping.set(key, newMachine);

        newMachine.index = Math.max(
          ...machines.map((machine) => machine.index)
        );

        newMachine.startIds = machines
          .map((machine) => machine.startIds)
          .flat(1);
        newMachine.endIds = machines.map((machine) => machine.endIds).flat(1);

        // console.log(machines.map((machine) => machine.index));

        newMachine.start = machines
          .map((machine) => machine.start)
          .flat(1)
          .map((machine) => get([machine]));
      }

      return mapping.get(key)!;
    };

    return {
      get,
    };
  }
}

export const ATOM = FiniteStateMachine.ATOM;
export const OR = FiniteStateMachine.OR;
export const CONCAT = FiniteStateMachine.CONCAT;
export const WORD = FiniteStateMachine.WORD;
export const STAR = FiniteStateMachine.STAR;
export const PLUS = FiniteStateMachine.PLUS;
export const OPTIONAL = FiniteStateMachine.OPTIONAL;
