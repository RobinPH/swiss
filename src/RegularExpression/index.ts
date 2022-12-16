import FiniteAutomata from "../FiniteAutomata";
import { Cloneable } from "../types";

export class RegularExpression<T extends any> implements Cloneable {
  static readonly EMPTY_SPACE = RegularExpression.ATOM(
    FiniteAutomata.EPSILON
  ).label("EPSILON");

  machine: FiniteAutomata<T>;
  _label?: T;

  constructor(machine: FiniteAutomata<T>) {
    this.machine = machine.clone();
  }

  clone() {
    const regex = new RegularExpression(this.machine) as this;
    return regex;
  }

  check(input: string, index = 0) {
    const result = this.machine.start.check(input, index);

    if (result && result.to === input.length) {
      return result;
    }

    return;
  }

  static OR<U extends RegularExpression<any>[]>(...args: U) {
    // static or<U extends RegularExpression<any>[]>(params: {
    //   label?: string;
    //   value: U extends RegularExpression<infer X>[] ? X : null;
    //   args: U;
    // }) {
    const start = new FiniteAutomata(null);
    const end = new FiniteAutomata(null);

    start.isFinal = false;
    end.isFinal = true;
    start.hide = true;

    for (const regex of args) {
      const cloned = FiniteAutomata.clone(regex.machine);

      cloned.end.addTransition({
        to: end.start,
      });
      // cloned.end = end.end;
      start.end.addTransition({
        to: cloned.start,
      });
      // start.end = cloned.end;
      // cloned.start = start.start;
    }

    end.start = start.start;
    start.end = end.end;

    return new RegularExpression(start) as RegularExpression<
      U extends RegularExpression<infer X>[] ? X : null
    >;
  }

  static CONCAT<U extends RegularExpression<any>[]>(...args: U) {
    const start = new FiniteAutomata(null);
    const end = new FiniteAutomata(null);
    start.isFinal = false;
    end.isFinal = true;
    start.hide = true;

    let machine = start;

    for (const regex of args) {
      const cloned = FiniteAutomata.clone(regex.machine);

      machine.end.addTransition({
        to: cloned.start,
      });

      // start.end = end.end;
      // machine.start = start.start;

      machine = cloned;
    }

    machine.end.addTransition({
      to: end.start,
    });

    end.start = start.start;
    start.end = end.end;

    return new RegularExpression(start) as RegularExpression<
      U extends RegularExpression<infer X>[] ? X : null
    >;
  }

  static STAR<U extends any>(arg: RegularExpression<U>) {
    const start = new FiniteAutomata(null);
    const end = new FiniteAutomata(null);
    start.isFinal = false;
    end.isFinal = true;
    start.hide = true;

    const cloned = FiniteAutomata.clone(arg.machine);

    cloned.end.addTransition({
      to: cloned.start,
    });

    start.end.addTransition({
      to: cloned.start,
    });

    start.end.addTransition({
      to: end.start,
    });

    cloned.end.addTransition({
      to: end.start,
    });

    end.start = start.start;
    start.end = end.end;

    return new RegularExpression(start) as RegularExpression<U>;
  }

  static PLUS<U extends any>(arg: RegularExpression<U>) {
    const start = new FiniteAutomata(null);
    const end = new FiniteAutomata(null);
    start.isFinal = false;
    end.isFinal = true;
    start.hide = true;

    const a = FiniteAutomata.clone(arg.machine);
    const b = FiniteAutomata.clone(a);

    b.end.addTransition({
      to: b.start,
    });

    a.end.addTransition({
      to: b.start,
    });

    a.end.addTransition({
      to: end.start,
    });

    start.end.addTransition({
      to: a.start,
    });

    b.end.addTransition({
      to: end.start,
    });

    end.start = start.start;
    start.end = end.end;

    return new RegularExpression(start) as RegularExpression<U>;
  }

  static OPTIONAL<U extends any>(arg: RegularExpression<U>) {
    const regex = RegularExpression.OR(
      arg.clone(),
      RegularExpression.EMPTY_SPACE.clone()
    );

    return regex.label(arg._label);
  }

  label<U extends T>(label: U) {
    this._label = label;
    this.machine.start.value = this._label;
    this.machine.end.value = this._label;

    return this as RegularExpression<T | U>;
  }

  hide(hide = true) {
    this.machine.start.hide = hide;

    return this;
  }

  static ATOM<U extends any>(character: string, hide = true) {
    const a = new FiniteAutomata(null, hide);
    const b = new FiniteAutomata(null, hide);
    a.isFinal = false;
    b.isFinal = true;
    a.hide = true;
    b.hide = true;

    a.end.addTransition({
      symbol: character,
      to: b.start,
    });

    a.end = b.end;
    b.start = a.start;

    return new RegularExpression(a) as RegularExpression<U>;
  }

  static fromWord(word: string) {
    const characters = word.split("");

    return RegularExpression.CONCAT(
      ...characters.map((character) => {
        return RegularExpression.ATOM(character, true);
      })
    );
  }

  static choices(...words: string[]) {
    return RegularExpression.OR(
      ...words.map((word) => RegularExpression.fromWord(word))
    ).hide();
  }

  static choicesHidden(...words: string[]) {
    return RegularExpression.OR(
      ...words.map((word) => RegularExpression.fromWord(word).hide())
    ).hide();
  }
}
