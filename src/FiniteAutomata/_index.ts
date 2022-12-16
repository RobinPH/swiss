import { v4 as uuidv4 } from "uuid";
import { Cloneable } from "../types";

type CheckResult<T extends any> = {
  from: number;
  to: number;
  subValues: CheckResult<T>[][];
  value: T;
};

export class FiniteAutomata<T extends any> implements Cloneable {
  static readonly EPSILON = "/ε";
  static readonly cloneCache = new Map<Symbol, FiniteAutomata<any>>();
  static cloneInitator: Symbol | undefined;
  static clone<U extends any>(machine: FiniteAutomata<U>) {
    if (FiniteAutomata.cloneCache.has(machine.id)) {
      return FiniteAutomata.cloneCache.get(machine.id)!;
    }

    return machine.clone();
  }

  transitions = new Map<string, Array<Array<FiniteAutomata<T>>>>();
  id = Symbol();
  value: T;
  label: string;

  constructor(params: { label?: string; value: T; atom: boolean }) {
    this.label = params.label ?? uuidv4();
    this.value = params.value;
  }

  check(input: string, index: number): CheckResult<T> | undefined {
    let results: Array<Array<CheckResult<T>>> | undefined;
    let currentIndex = index;

    const run = (character: string, tasks?: FiniteAutomata<T>[][]) => {
      if (tasks && tasks.length === 0) {
        if (!results) results = [];
        results.push([
          {
            from: index,
            to: currentIndex + character.length,
            subValues: [],
            value: this.value,
          },
        ]);
      }

      for (const machines of tasks ?? []) {
        currentIndex = index;
        const subResult = new Array<CheckResult<T>>();

        for (const machine of machines) {
          const res = machine.check(input, currentIndex + character.length);

          if (!res) break;

          currentIndex = res.to;

          // if (machine === this) {
          //   if (res.subValues[0]) subResult.push(res.subValues[0][0]);
          // } else {
          subResult.push(res);
          // }
        }

        if (subResult.length === machines.length) {
          if (!results) results = [];

          results.push(subResult);
        }
      }
    };

    // if (index <= input.length - 1) {
    //   const character = input[index];
    //   const tasks = this.transitions.get(character);

    //   if (tasks) {
    //     if (tasks.length === 0) {
    //       results = [];
    //     }
    //   }

    //   for (const machines of tasks ?? []) {
    //     currentIndex = index;
    //     const subResult = new Array<CheckResult<T>>();

    //     for (const machine of machines) {
    //       const res = machine.check(input, currentIndex + 1);

    //       if (!res) {
    //         break;
    //       }

    //       currentIndex = res.to;

    //       subResult.push(res);
    //     }

    //     if (subResult.length === machines.length) {
    //       if (!results) {
    //         results = [];
    //       }

    //       results.push(subResult);
    //     }
    //   }
    // }

    run("", this.transitions.get(FiniteAutomata.EPSILON));

    if (index <= input.length - 1) {
      const character = input[index];
      run(character, this.transitions.get(character));
    }

    if (results) {
      return {
        from: index,
        to: results.reduce(
          (mx, subResults) =>
            Math.max(
              mx,
              subResults.reduce((mx, result) => Math.max(mx, result.to), 0)
            ),
          index
        ),
        subValues: results,
        value: this.value,
      };
    }
  }

  clone() {
    const symbol = Symbol();
    if (!FiniteAutomata.cloneInitator) {
      FiniteAutomata.cloneInitator = symbol;
      FiniteAutomata.cloneCache.clear();
    }

    const machine = new FiniteAutomata<T>({
      label: this.label,
      value: this.value,
    }) as this;
    FiniteAutomata.cloneCache.set(this.id, machine);

    for (const [symbol, tasks] of this.transitions) {
      machine.transitions.set(
        symbol,
        tasks.map((task) => {
          return task.map((machine) => FiniteAutomata.clone(machine));
        })
      );
    }

    if (FiniteAutomata.cloneInitator === symbol) {
      FiniteAutomata.cloneInitator = undefined;
      FiniteAutomata.cloneCache.clear();
    }

    return machine;
  }

  addTransition(symbol: string, machines: Array<FiniteAutomata<T>>) {
    if (!this.transitions.has(symbol)) {
      this.transitions.set(symbol, []);
    }

    this.transitions.get(symbol)!.push(machines);
  }
}
