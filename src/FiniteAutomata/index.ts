import { PartialK } from "../types";
import { v4 as uuidv4 } from "uuid";

export enum FiniteAutomataType {
  DFA = "DFA",
  NFA = "NFA",
  EPSILON_NFA = "EPSILON_NFA",
}

// export type State<T extends any = string> = {
//   id: string;
//   value: T[];
//   transitions: Map<string, Set<State<T>>>;
//   isStart?: boolean;
//   isAcceptState?: boolean;
// };

export class State<T extends any = string> {
  id: string;
  value: T[];
  transitions: Map<string, Set<State<T>>>;
  isStart: boolean;
  isAcceptState: boolean;

  constructor(
    params: {
      id?: string;
      value?: T[];
      transitions?: Map<string, Set<State<T>>>;
      isStart?: boolean;
      isAcceptState?: boolean;
    } = {}
  ) {
    this.id = params.id ?? uuidv4();
    this.value = params.value ?? [];
    this.transitions = params.transitions ?? new Map();
    this.isStart = params.isStart ?? false;
    this.isAcceptState = params.isAcceptState ?? false;
  }

  clone() {
    return new State<T>({
      id: this.id,
      value: this.value,
      transitions: new Map(),
      isStart: this.isStart,
      isAcceptState: this.isAcceptState,
    });
  }
}

export default class FiniteAutomata<T extends string> {
  static readonly EPSILON = "ε";

  #states = new Map<string, State<T>>();
  newIdMapping = new Map<string, string>();

  check(word: string) {
    const characters = word.split("");

    const { startState } = this;

    if (!startState) {
      throw new Error("No start state found.");
    }

    const dfa = (state: State<T>, characters: Array<string>): T[] | null => {
      const [character, ...rest] = characters;

      let result: T[] | null = null;

      for (const to of state.transitions.get(FiniteAutomata.EPSILON) ?? []) {
        result ??=
          characters.length === 0 && to.isAcceptState
            ? to.value
            : dfa(to, characters);

        if (result) {
          break;
        }
      }

      for (const to of state.transitions.get(character) ?? []) {
        result ??=
          rest.length === 0 && to.isAcceptState ? to.value : dfa(to, rest);

        if (result) {
          break;
        }
      }

      return result;
    };

    return dfa(startState, characters);
  }

  fromEpsilonNFAToNFA() {
    const { alphabet } = this;
    const nfa = new FiniteAutomata<T>();

    for (const state of this.#states.values()) {
      nfa.addState(state.clone());
    }

    for (const state of this.#states.values()) {
      const eClosure = this.eClosure(state);

      const from = nfa.getState(state.id)!;

      from.isAcceptState = eClosure.some((s) => s.isAcceptState);

      for (const symbol of alphabet) {
        const a = this.eClosure(state);
        const b = this.transition(symbol, ...a);
        const c = this.eClosure(...b);

        const to = c.map((s) => {
          return nfa.getState(s.id);
        });

        nfa.addTransition(symbol, from, ...to);
      }
    }

    return nfa;
  }

  fromNFAToDFA() {
    const queue = new Array<{
      entry: Array<State<T>>;
      state: State<T>;
    }>();
    const { alphabet, startState } = this;
    const added = new Array<Array<State<T>>>();

    if (!startState) {
      throw new Error("No start state found.");
    }

    const dfa = new FiniteAutomata<T>();

    const enqueue = (...states: Array<State<T>>) => {
      states.sort((a, b) => {
        if (a.id.length === b.id.length) {
          if (a.id > b.id) return 1;
          else if (a.id < b.id) return -1;
          else return 0;
        } else {
          return a.id.length - b.id.length;
        }
      });

      const isAlreadyEnqueued = !!added.find((a) => {
        if (a.length !== states.length) {
          return false;
        }

        for (let i = 0; i < states.length; i++) {
          if (a[i] !== states[i]) {
            return false;
          }
        }

        return true;
      });

      const newState = {
        id: states.map((s) => s.id).join("-"),
        value: states.map((s) => s.value).flat(),
        isAcceptState: states.some((s) => s.isAcceptState),
        isStart: states.length === 1 ? states[0].isStart : false,
        transitions: new Map(),
      } as State<T>;

      if (!isAlreadyEnqueued) {
        dfa.addState(newState);

        queue.push({
          entry: states,
          state: newState,
        });

        added.push(states);

        return newState;
      } else {
        return dfa.getState(newState.id);
      }
    };

    const dequeue = () => {
      return queue.shift();
    };

    enqueue(startState);

    while (queue.length > 0) {
      const item = dequeue();
      const { entry, state: newState } = item!;

      const from = dfa.getState(newState.id);

      for (const symbol of alphabet) {
        const states = new Set<State<T>>();

        for (const state of entry) {
          for (const s of this.transition(symbol, state)) {
            states.add(s);
          }
        }

        if (states.size === 0) continue;

        const to = enqueue(...states);

        dfa.addTransition(symbol, from, to);
      }
    }

    return dfa;
  }

  minimizeDFA() {
    // TODO:
    return this;
  }

  eClosure(...states: Array<State<T>>) {
    const result = new Set<State<T>>();

    for (const state of states) {
      const visited = new Set<State<T>>();

      const _eClosure = (_state: State<T>) => {
        const result = new Set<State<T>>();
        result.add(_state);

        if (!visited.has(_state)) {
          visited.add(_state);
        }

        for (const [symbol, states] of _state.transitions) {
          if (symbol !== FiniteAutomata.EPSILON) {
            continue;
          }

          for (const s of states) {
            for (const reachable of _eClosure(s)) {
              result.add(reachable);
            }
          }
        }

        return result;
      };

      for (const reachable of _eClosure(state)) {
        result.add(reachable);
      }
    }

    return Array.from(result);
  }

  transition(symbol: string, ...states: Array<State<T>>) {
    if (symbol === FiniteAutomata.EPSILON) {
      return this.eClosure(...states);
    }

    const result = new Set<State<T>>();

    for (const state of states) {
      for (const s of state.transitions.get(symbol) ?? []) {
        result.add(s);
      }
    }

    return Array.from(result);
  }

  addTransition(
    symbol: string,
    from: State<T> | string,
    ...to: Array<State<T> | string>
  ) {
    if (typeof from !== "string") {
      if (!from.transitions.has(symbol)) {
        from.transitions.set(symbol, new Set());
      }

      for (const s of to) {
        from.transitions
          .get(symbol)!
          .add(typeof s === "string" ? this.getState(s) : s);
      }
    } else {
      this.addTransition(symbol, this.getState(from), ...to);
    }
  }

  addState(
    ...states: Array<
      PartialK<State<T>, "id" | "transitions" | "isStart" | "isAcceptState">
    >
  ) {
    const addedStates = new Array<State<T>>();

    for (const state of states) {
      const id = state.id ?? uuidv4();

      if (this.#states.has(id)) {
        // console.warn(`State ${id} has been overwritten.`);
      }

      const newState = new State({
        id,
        isStart: false,
        isAcceptState: false,
        transitions: new Map(),
        ...state,
      });

      this.#states.set(id, newState);

      addedStates.push(this.getState(id));
    }

    return addedStates;
  }

  getState(id: string) {
    const state = this.#states.get(id);

    if (!state) {
      throw new Error(`State ${id} not found in new states`);
    }

    return state;
  }

  printTransitionTable() {
    const table = [];

    const { transitions } = this;

    for (const [id, t] of transitions) {
      const row = {
        state: id,
      } as Record<any, any>;

      for (const [symbol, to] of t) {
        row[symbol] =
          to.length === 0
            ? "∅"
            : `{${to.map((state) => state.id.slice(0, 6)).join(", ")}}`;
      }

      table.push(row);
    }

    table.sort((a, b) => {
      if (a.state.length === b.state.length) {
        if (a.state > b.state) return 1;
        else if (a.state < b.state) return -1;
        else return 0;
      } else {
        return a.state.length - b.state.length;
      }
    });

    FiniteAutomata.printTable(
      table.map((row) => {
        const state = this.getState(row.state);
        let prefix = "";

        if (state.isStart) {
          prefix += "->";
        }

        if (state.isAcceptState) {
          prefix += "*";
        }

        return {
          ...row,
          state: `${prefix}[${row.state.slice(0, 6)}]`,
        };
      })
    );
  }

  clone(newId = false): FiniteAutomata<T> {
    return new FiniteAutomata<T>().merge(this, newId);
  }

  merge<U extends string>(fa: FiniteAutomata<U>, newId = false) {
    return FiniteAutomata.merge<T, U>(this, fa, newId);
  }

  removeValues() {
    for (const state of this.#states.values()) {
      state.value = [];
    }
  }

  static merge<U extends string, V extends string>(
    a: FiniteAutomata<U>,
    b: FiniteAutomata<V>,
    newId = false
  ) {
    const result = new FiniteAutomata<U | V>();

    result.newIdMapping.clear();

    const _merge = (fa: FiniteAutomata<U | V>) => {
      for (const state of fa.states.values()) {
        const newState = state.clone();

        if (newId) {
          newState.id = uuidv4();
        }

        result.newIdMapping.set(state.id, newState.id);

        result.addState(newState);
      }

      for (const state of fa.states.values()) {
        for (const [symbol, to] of state.transitions) {
          result.addTransition(
            symbol,
            result.getState(result.newIdMapping.get(state.id)!),
            ...Array.from(to).map((s) =>
              result.getState(result.newIdMapping.get(s.id)!)
            )
          );
        }
      }
    };

    _merge(a);
    _merge(b);

    return result;
  }

  get startState() {
    return Array.from(this.#states.values()).find((s) => s.isStart);
  }

  get type() {
    let isNFA = false;

    for (const { transitions } of this.#states.values()) {
      for (const [symbol, states] of transitions) {
        if (symbol === FiniteAutomata.EPSILON) {
          return FiniteAutomataType.EPSILON_NFA;
        }

        if (states.size > 1) {
          isNFA = true;
        }
      }
    }

    return isNFA ? FiniteAutomataType.NFA : FiniteAutomataType.DFA;
  }

  get alphabet() {
    const alphabet = new Set<string>();

    for (const state of this.#states.values()) {
      for (const symbol of state.transitions.keys()) {
        alphabet.add(symbol);
      }
    }

    return alphabet;
  }

  get states() {
    return this.#states;
  }

  get transitions() {
    const alphabet =
      this.type === FiniteAutomataType.EPSILON_NFA
        ? [...this.alphabet, FiniteAutomata.EPSILON]
        : this.alphabet;

    const transitions = new Map<string, Map<string, Array<State<T>>>>();

    for (const state of this.#states.values()) {
      const t = new Map<string, Array<State<T>>>();
      transitions.set(state.id, t);

      for (const symbol of alphabet) {
        const to = Array.from(state.transitions.get(symbol) ?? []);

        t.set(symbol, to);
      }
    }

    return transitions;
  }

  static printTable(table: Array<Record<any, any>>) {
    const headers = new Array<string>();

    for (const row of table) {
      for (const key of Object.keys(row)) {
        if (!headers.includes(key)) {
          headers.push(key);
        }
      }
    }

    const lengths = headers.map((header) =>
      Math.max(
        ...[header, ...table.map((row) => row[header])].map(
          (value) => value.toString().length
        )
      )
    );

    console.log(
      [headers, ...table.map((row) => headers.map((header) => row[header]))]
        .map((row) =>
          row
            .map((value, idx) => value.toString().padEnd(lengths[idx], " "))
            .join(" | ")
        )
        .join("\n")
    );
  }
}
