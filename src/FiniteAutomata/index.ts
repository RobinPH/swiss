import { Cloneable } from "../types";
import { v4 as uuidv4 } from "uuid";

enum CheckStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  PROCESSING = "PROCESSING",
  CHILD_FAILED = "CHILD_FAILED",
}

type CheckResult<T extends any> = {
  from: number;
  to: number;
  subValues: Array<CheckResult<T>>;
  value: T;
  machine: FiniteAutomata<T>;
  status: CheckStatus;
  charLength: number;
};

type TransitionSymbol =
  | string
  | ((character: string) => boolean)
  | {
      key?: string;
      symbol: (character: string) => boolean;
    }
  | {
      key?: string;
      symbol: string;
    };

export default class FiniteAutomata<T extends any> implements Cloneable {
  static readonly EPSILON = "/ε";

  static clonedCache = new Map<Symbol, FiniteAutomata<any>>();
  static cloneInitiator: Symbol | undefined;
  static clone<U extends any>(machine: FiniteAutomata<U>) {
    if (FiniteAutomata.clonedCache.has(machine.id)) {
      return FiniteAutomata.clonedCache.get(machine.id)!;
    }

    return machine.clone();
  }

  readonly id = Symbol();

  readonly transitions = new Map<TransitionSymbol, Set<FiniteAutomata<T>>>();
  value: T;
  start: FiniteAutomata<T> = this;
  end: FiniteAutomata<T> = this;
  isFinal = false;
  label = uuidv4();
  test = new Array<Array<CheckResult<T>>>();
  hide: boolean;

  constructor(value: T, hide = false) {
    this.value = value;
    this.hide = hide;
  }

  check(
    input: string,
    index: number = 0
  ): Omit<CheckResult<T>, "machine" | "status" | "charLength"> | undefined {
    const res = this._check(input, index, 0);

    // console.log(res.stack.map((s) => [s.value, s.status]));

    const process = (stack: Array<CheckResult<T>>) => {
      const starts = new Array<CheckResult<T>>();
      const freq = new Map<FiniteAutomata<T>, number>();

      for (let i = stack.length - 1; i >= 0; i--) {
        const res = stack[i];
        starts.push(res);

        // console.log(starts.map((s) => s.value));

        freq.set(res.machine, (freq.get(res.machine) ?? 0) + 1);

        if (freq.get(res.machine.start)! > 0) {
          const children = new Array<CheckResult<T>>();
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
            ...children.filter((child) => !child.machine.hide)
          );
          last.to = to + last.charLength;
          last.from = from;

          freq.set(res.machine, freq.get(res.machine)! - 1);
        }
      }

      return starts;
    };

    const removeKeys = <U extends keyof CheckResult<T>>(
      obj: CheckResult<T>,
      keys: Array<U>
    ): Omit<CheckResult<T>, U> => {
      for (const key of keys) {
        delete obj[key];
      }

      for (const subValue of obj.subValues) {
        removeKeys(subValue, keys);
      }

      return obj;
    };

    if (!res.stack[0]) {
      return;
    }

    const foo = process(res.stack)[0];

    if (!foo) {
      return;
    }

    const result = removeKeys(foo, ["machine", "status", "charLength"]);

    if (result.to !== input.length) {
      return;
    }

    return result;
  }

  _check(
    input: string,
    index: number,
    characterLength: number,
    stack = new Array<CheckResult<T>>()
  ): {
    to: number;
    status: CheckStatus;
    stack: Array<CheckResult<T>>;
  } {
    let currentIndex = index;

    const result: CheckResult<T> = {
      from: currentIndex,
      to: currentIndex,
      subValues: [],
      value: this.value,
      status: CheckStatus.PROCESSING,
      machine: this,
      charLength: characterLength,
    };

    if (this.isFinal) {
      result.status = CheckStatus.SUCCESS;
      // const end = stack[stack.length - 1];
      // end.to = Math.max(end.to, currentIndex);
      // const members = new Array<CheckResult<T>>();
      // let to = 0;
      // while (stack[stack.length - 1].machine !== this.start) {
      //   const res = stack.pop()!;
      //   members.push(res);
      //   to = Math.max(to, res.to);
      // }
      // stack[stack.length - 1].subValues.push(...members.reverse());
      // stack[stack.length - 1].to = Math.max(stack[stack.length - 1].to, to);
      // console.log(this.value, this.transitions.keys());
    } else {
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

    for (const { character, machines = new Set<FiniteAutomata<T>>() } of runs) {
      // console.log(
      //   `'${character}'`,
      //   this.value,
      //   Array.from(machines).map((v) => v.value)
      // );
      for (const machine of machines) {
        result.subValues = [];
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
            // continue;
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

  static formatResult<U extends any>(
    result: Omit<CheckResult<U>, "machine" | "status" | "charLength">,
    output: string[] = [],
    depth = 0
  ) {
    const prefix = "".padStart(depth, "\t");
    output.push(prefix + `${result.value} ${result.from}:${result.to}`);

    for (const subValue of result.subValues) {
      this.formatResult(subValue, output, depth + 1);
    }

    // output.push(prefix + `${result.value}`);

    return output;
  }

  addTransition(params: { symbol?: TransitionSymbol; to: FiniteAutomata<T> }) {
    const { symbol = FiniteAutomata.EPSILON } = params;

    if (!this.transitions.has(symbol)) {
      this.transitions.set(symbol, new Set());
    }

    this.transitions.get(symbol)!.add(params.to);
  }

  clone() {
    const symbol = Symbol();
    if (!FiniteAutomata.cloneInitiator) {
      FiniteAutomata.cloneInitiator = symbol;
      FiniteAutomata.clonedCache.clear();
    }

    const cloned = new FiniteAutomata<T>(this.value) as this;
    FiniteAutomata.clonedCache.set(this.id, cloned);

    cloned.label = this.label;
    cloned.isFinal = this.isFinal;
    cloned.start = FiniteAutomata.clone(this.start);
    cloned.end = FiniteAutomata.clone(this.end);
    cloned.hide = this.hide;

    for (const [transitionSymbol, machines] of this.transitions) {
      cloned.transitions.set(
        transitionSymbol,
        new Set(
          Array.from(machines).map((machine) => FiniteAutomata.clone(machine))
        )
      );
    }

    if (FiniteAutomata.cloneInitiator === symbol) {
      FiniteAutomata.cloneInitiator = undefined;
      FiniteAutomata.clonedCache.clear();
    }

    return cloned;
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

  static atom<U extends any>(params: { character: string; value: U }) {
    const a = new FiniteAutomata(params.value);
    const b = new FiniteAutomata(params.value);
    a.isFinal = false;
    b.isFinal = true;

    a.end.addTransition({
      symbol: params.character,
      to: b.start,
    });

    a.end = b.end;
    b.start = a.start;

    return a;
  }
}
