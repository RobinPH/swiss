import { v4 as uuidv4 } from "uuid";
import { Characters } from "../types";

enum CheckStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  PROCESSING = "PROCESSING",
  CHILD_FAILED = "CHILD_FAILED",
}

type MakeParent<
  Children extends FiniteAutomata<any, any, any>[],
  Parent extends any
> = {
  [K in keyof Children]: Children[K] extends FiniteAutomata<
    infer V,
    infer C,
    any
  >
    ? FiniteAutomata<V, C, Parent>
    : never;
};

export type MakeCheckSubResult<
  Value extends any,
  Children extends FiniteAutomata<any, any, any>[]
> = {
  [K in keyof Children]: Children[K] extends FiniteAutomata<any, any, Value>
    ? CheckResult<
        Children[K] extends FiniteAutomata<infer V, any, Value> ? V : never,
        Children[K] extends FiniteAutomata<any, infer C, Value> ? C : never
      >
    : never;
};

export type CheckResult<
  Value extends any,
  Children extends FiniteAutomata<any, any>[]
> = {
  from: number;
  to: number;
  subValues: MakeCheckSubResult<Value, Children>;
  value: Value;
  machine: FiniteAutomata<Value, Children>;
  status: CheckStatus;
  charLength: number;
  token: boolean;
  text: string;
};

type TransitionSymbol = string;

export default class FiniteAutomata<
  Value extends any,
  Children extends Array<FiniteAutomata<any, any, any>> = [],
  Parent extends any = any
> {
  static readonly EPSILON = "/ε";
  static readonly EMPTY_SPACE = FiniteAutomata.ATOM(FiniteAutomata.EPSILON)
    .setValue("EPSILON")
    .hide();

  static clonedCache = new Map<Symbol, FiniteAutomata<any, any>>();
  static cloneInitiator: Symbol | undefined;

  readonly id = Symbol();

  transitions = new Map<string, Set<FiniteAutomata<any, any>>>();
  value: Value;
  start: FiniteAutomata<any, any> = this;
  end: FiniteAutomata<any, any> = this;
  isFinal = false;
  label = uuidv4();
  #hide = false;
  #cloneable = true;
  #token = false;
  parent?: Parent;

  constructor(value: Value) {
    this.value = value;
  }

  static OR<U extends FiniteAutomata<any, any>[]>(...machines: U) {
    const start = new FiniteAutomata<null, [U[number]]>(null);
    const end = new FiniteAutomata(null);

    start.isFinal = false;
    end.isFinal = true;
    start.#hide = true;

    for (const machine of machines) {
      const cloned = machine.clone();

      cloned.end.addTransition({
        symbol: FiniteAutomata.EPSILON,
        to: end.start,
      });

      start.end.addTransition({
        symbol: FiniteAutomata.EPSILON,
        to: cloned.start,
      });
    }

    end.start = start.start;
    start.end = end.end;

    return start;
  }

  static CONCAT<U extends FiniteAutomata<any, any>[]>(...machines: U) {
    const start = new FiniteAutomata<null, U>(null);
    const end = new FiniteAutomata(null);
    start.isFinal = false;
    end.isFinal = true;
    start.#hide = true;

    let machine = start as unknown as FiniteAutomata<any, any>;

    for (const _machine of machines) {
      const cloned = _machine.clone();

      machine.end.addTransition({
        symbol: FiniteAutomata.EPSILON,
        to: cloned.start,
      });

      machine = cloned;
    }

    machine.end.addTransition({
      symbol: FiniteAutomata.EPSILON,
      to: end.start,
    });

    end.start = start.start;
    start.end = end.end;

    return start;
  }

  static STAR<U extends FiniteAutomata<any, any>>(machine: U) {
    const end = new FiniteAutomata(null);
    const start = new FiniteAutomata<null, U[]>(null);
    start.isFinal = false;
    end.isFinal = true;
    start.#hide = true;

    const cloned = machine.clone();

    cloned.end.addTransition({
      symbol: FiniteAutomata.EPSILON,
      to: cloned.start,
    });

    start.end.addTransition({
      symbol: FiniteAutomata.EPSILON,
      to: cloned.start,
    });

    start.end.addTransition({
      symbol: FiniteAutomata.EPSILON,
      to: end.start,
    });

    cloned.end.addTransition({
      symbol: FiniteAutomata.EPSILON,
      to: end.start,
    });

    end.start = start.start;
    start.end = end.end;

    return start;
  }

  static PLUS<U extends FiniteAutomata<any, any>>(machine: U) {
    const start = new FiniteAutomata<null, [U, ...U[]]>(null);
    const end = new FiniteAutomata(null);
    start.isFinal = false;
    end.isFinal = true;
    start.#hide = true;

    const a = machine.clone(true);
    const b = a.clone(true);

    b.end.addTransition({
      symbol: FiniteAutomata.EPSILON,
      to: b.start,
    });

    a.end.addTransition({
      symbol: FiniteAutomata.EPSILON,
      to: b.start,
    });

    a.end.addTransition({
      symbol: FiniteAutomata.EPSILON,
      to: end.start,
    });

    start.end.addTransition({
      symbol: FiniteAutomata.EPSILON,
      to: a.start,
    });

    b.end.addTransition({
      symbol: FiniteAutomata.EPSILON,
      to: end.start,
    });

    end.start = start.start;
    start.end = end.end;

    return start;
  }

  static OPTIONAL<U extends FiniteAutomata<any, any>>(machine: U) {
    return FiniteAutomata.OR(
      machine.clone(true) as U,
      FiniteAutomata.EMPTY_SPACE.clone(true)
    );
  }

  check(
    input: string,
    index: number = 0
  ): CheckResult<Value, Children> | undefined {
    const res = this._check(input, index, 0);

    const process = (stack: Array<CheckResult<Value, Children>>) => {
      const starts = new Array<CheckResult<Value, Children>>();
      const freq = new Map<FiniteAutomata<any, any>, number>();

      for (let i = stack.length - 1; i >= 0; i--) {
        const res = stack[i];
        starts.push(res);

        freq.set(res.machine, (freq.get(res.machine) ?? 0) + 1);

        if (freq.get(res.machine.start)! > 0) {
          const children = new Array<CheckResult<Value, Children>>();
          let to = 0;
          let from = 1e9;

          do {
            const machine = starts.pop()!;
            to = Math.max(to, machine.to);
            from = Math.min(from, machine.to);
            children.push(machine);

            if (starts.length === 0) {
              return [];
            }
          } while (
            starts[starts.length - 1].machine.start !== res.machine.start
          );

          const last = starts[starts.length - 1];
          last.subValues.push(
            ...children.filter((child) => !child.machine.#hide)
          );
          last.to = to + last.charLength;
          last.from = from;
          last.text = input.slice(last.from, last.to);

          freq.set(res.machine, freq.get(res.machine)! - 1);
        }
      }

      return starts;
    };

    const removeKeys = <U extends keyof CheckResult<Value, Children>>(
      obj: CheckResult<Value, Children>,
      keys: Array<U>
    ): Omit<CheckResult<Value, Children>, U> => {
      for (const key of keys) {
        delete obj[key];
      }

      // @ts-ignore
      obj.subValues = obj.subValues.filter(
        (subValue) => !subValue.machine.#hide
      );

      for (const subValue of obj.subValues) {
        removeKeys(subValue, keys);
      }

      return obj;
    };

    if (!res.stack[0]) {
      return;
    }

    return process(res.stack)[0];
  }

  _check(
    input: string,
    index: number,
    characterLength: number,
    stack = new Array<CheckResult<Value, Children>>()
  ): {
    to: number;
    status: CheckStatus;
    stack: Array<CheckResult<Value, Children>>;
  } {
    let currentIndex = index;

    const result: CheckResult<Value, Children> = {
      from: currentIndex,
      to: currentIndex,
      subValues: [] as MakeCheckSubResult<Value, Children>,
      value: this.value,
      status: CheckStatus.PROCESSING,
      machine: this as FiniteAutomata<any, any>,
      charLength: characterLength,
      token: this.#token,
      text: "",
    };

    if (this.isFinal) {
      result.status = CheckStatus.SUCCESS;
    }

    stack.push(result);

    const runs = [
      {
        character: "",
        machines: this.transitions.get(FiniteAutomata.EPSILON),
      },
    ];

    if (index <= input.length - 1) {
      const character = input[index];
      runs.push({ character, machines: this.transitions.get(character) });
    }

    for (const {
      character,
      machines = new Set<FiniteAutomata<Value>>(),
    } of runs) {
      for (const machine of machines) {
        result.subValues = [] as MakeCheckSubResult<Value, Children>;
        result.to = index;
        const charLength = character.length;
        const res = machine._check(
          input,
          index + charLength,
          charLength,
          stack
        );

        if (res.status === CheckStatus.CHILD_FAILED) {
          continue;
        }

        if (res.status === CheckStatus.SUCCESS) {
          result.status = CheckStatus.SUCCESS;
          break;
        } else if (res.status === CheckStatus.FAILED) {
          if (result.status === CheckStatus.PROCESSING) {
            result.status = CheckStatus.CHILD_FAILED;
          }
        }
      }
    }

    if (result.status !== CheckStatus.SUCCESS) {
      stack.pop();
      if (result.status !== CheckStatus.CHILD_FAILED) {
        result.status = CheckStatus.FAILED;
      }
    }

    return {
      to: currentIndex,
      status: result.status,
      stack,
    };
  }

  setValue<U extends string>(value: U) {
    const me = this as unknown as FiniteAutomata<U, MakeParent<Children, U>>;
    me.value = value;
    me.start.value = value;
    me.end.value = value;
    return me;
  }

  addTransition<
    U extends TransitionSymbol,
    V extends FiniteAutomata<any, any>
  >(params: { symbol: U; to: V }) {
    const { symbol = FiniteAutomata.EPSILON, to } = params;
    const me = this as unknown as FiniteAutomata<Value, Children>;

    if (!me.transitions.has(symbol)) {
      me.transitions.set(symbol, new Set());
    }

    me.transitions.get(symbol)!.add(to);

    return me;
  }

  clone(force: boolean = false) {
    if (!this.#cloneable && !force) {
      return this;
    }

    const symbol = Symbol();
    if (!FiniteAutomata.cloneInitiator) {
      FiniteAutomata.cloneInitiator = symbol;
      FiniteAutomata.clonedCache.clear();
    }

    if (FiniteAutomata.clonedCache.has(this.id)) {
      return FiniteAutomata.clonedCache.get(this.id)! as FiniteAutomata<
        Value,
        Children
      >;
    }

    const cloned = new FiniteAutomata<Value, Children>(this.value);
    FiniteAutomata.clonedCache.set(this.id, cloned);

    cloned.label = this.label;
    cloned.isFinal = this.isFinal;
    cloned.start = this.start.clone();
    cloned.end = this.end.clone();
    cloned.#hide = this.#hide;
    cloned.#token = this.#token;
    cloned.#cloneable = this.#cloneable;

    for (const [transitionSymbol, machines] of this.transitions) {
      cloned.transitions.set(
        transitionSymbol,
        new Set(Array.from(machines).map((machine) => machine.clone()))
      );
    }

    if (FiniteAutomata.cloneInitiator === symbol) {
      FiniteAutomata.cloneInitiator = undefined;
      FiniteAutomata.clonedCache.clear();
    }

    return cloned as this;
  }

  cloneable(cloneable: boolean = true) {
    this.#cloneable = cloneable;

    return this;
  }

  hide(hide = true) {
    this.#hide = hide;
    return this;
  }

  token(token = true) {
    this.#token = token;
    this.start.#token = token;
    this.end.#token = token;

    return this;
  }

  isToken() {
    return this.#token;
  }

  // @ts-ignore
  toJSON(depth = 5) {
    if (depth < 0) {
      return {};
    }

    const me = this;
    return {
      value: me.value,
      isFinal: this.isFinal,
      transitions: Array.from(me.transitions.entries()).map(
        ([symbol, machines]) => {
          return {
            symbol,
            machines: Array.from(machines).map((machine) =>
              machine.toJSON(depth - 1)
            ),
          };
        }
      ),
    };
  }

  static ATOM(character: string) {
    const a = new FiniteAutomata(null);
    const b = new FiniteAutomata(null);
    a.isFinal = false;
    b.isFinal = true;

    const machine = a.addTransition({
      symbol: character,
      to: b.start,
    });

    a.end = b.end;
    b.start = a.start;

    return machine;
  }

  static WORD<U extends string>(word: U) {
    const characters = word.split("") as Characters<U>;

    return FiniteAutomata.CONCAT(
      ...characters.map((character) => {
        const machine = FiniteAutomata.ATOM(character).setValue(character);
        machine.#hide = true;
        return machine;
      })
    ).setValue(word);
  }

  static CHOICES<U extends string[]>(...words: U) {
    return FiniteAutomata.OR(...words.map((word) => FiniteAutomata.WORD(word)));
  }
}
