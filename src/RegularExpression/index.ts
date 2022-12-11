import { FiniteAutomata } from "../FiniteAutomata";
import { Cloneable } from "../types";

export class RegularExpression<T extends any> implements Cloneable {
  static readonly EMPTY_SPACE = RegularExpression.atom(
    FiniteAutomata.EPSILON,
    "epsilon"
  );

  machine: FiniteAutomata<T>;

  constructor(machine: FiniteAutomata<T>) {
    this.machine = machine.clone();
  }

  clone() {
    const regex = new RegularExpression(this.machine) as this;
    return regex;
  }

  check(input: string, index = 0) {
    const result = this.machine.check(input, index);

    if (result && result.to === input.length) {
      return result;
    }

    return;
  }

  static concat<U extends RegularExpression<any>[]>(params: {
    label?: string;
    value: U extends RegularExpression<infer X>[] ? X : null;
    args: U;
  }) {
    const machine = new FiniteAutomata({
      label: params.label,
      value: params.value,
    });

    machine.addTransition(
      FiniteAutomata.EPSILON,
      params.args.map((arg) => arg.clone().machine)
    );

    return new RegularExpression(machine);
  }

  static or<U extends RegularExpression<any>[]>(params: {
    label?: string;
    value: U extends RegularExpression<infer X>[] ? X : null;
    args: U;
  }) {
    const machine = new FiniteAutomata({
      label: params.label,
      value: params.value,
    });

    for (const regex of params.args) {
      machine.addTransition(FiniteAutomata.EPSILON, [regex.clone().machine]);
    }

    return new RegularExpression(machine);
  }

  static star<U extends RegularExpression<any>>(params: {
    label?: string;
    value: U extends RegularExpression<infer X> ? X : null;
    args: U;
  }) {
    const machine = new FiniteAutomata({
      label: params.label,
      value: params.value,
    });

    machine.addTransition(FiniteAutomata.EPSILON, [
      params.args.clone().machine,
      machine,
    ]);
    machine.addTransition(FiniteAutomata.EPSILON, []);

    return new RegularExpression(machine);
  }

  static plus<U extends any>(params: {
    label?: string;
    value: U;
    args: RegularExpression<U>;
  }) {
    const a = params.args.clone();
    return RegularExpression.concat({
      value: params.value,
      args: [
        a,
        RegularExpression.star({
          value: params.value,
          args: a,
        }),
      ],
    });
  }

  static optional<U extends any>(params: {
    label?: string;
    value: U;
    args: RegularExpression<U>;
  }) {
    return RegularExpression.or({
      value: params.value,
      args: [params.args.clone(), RegularExpression.EMPTY_SPACE.clone()],
    });
  }

  static atom<U extends any>(character: string, value: U) {
    const symbol =
      character === FiniteAutomata.EPSILON
        ? character
        : character.length >= 1
        ? character[0]
        : character;

    const machine = new FiniteAutomata<U>({
      label: character,
      value,
    });

    if (!machine.transitions.has(symbol)) {
      machine.transitions.set(symbol, []);
    }

    const regex = new RegularExpression(machine);

    return regex;
  }

  static fromWord<U extends any>(word: string, value: string) {
    const characters = word.split("");

    return RegularExpression.concat({
      args: characters.map((character) => {
        return RegularExpression.atom(character, character);
      }),
      value,
    });
  }

  static choices<U extends any>(
    choices: { word: string; value: string }[],
    value: string
  ) {
    return RegularExpression.or({
      value,
      args: choices.map(({ word, value }) =>
        RegularExpression.fromWord(word, value)
      ),
    });
  }
}
