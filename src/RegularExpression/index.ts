import FiniteAutomata, { State } from "../FiniteAutomata";

export default class RegularExpression<T extends string> {
  fa: FiniteAutomata<T>;
  startState: State<T>;
  endStates = new Array<State<T>>();

  constructor(
    params: {
      fa?: FiniteAutomata<T>;
      startState?: State<T>;
      endStates?: Array<State<T>>;
    } = {}
  ) {
    this.fa = params.fa ?? new FiniteAutomata<T>();
    this.startState = params.startState
      ? this.fa.getState(params.startState.id)
      : new State({
          value: [],
          isStart: true,
          isAcceptState: true,
        });
    this.fa.addState(this.startState);
    this.endStates = (params.endStates ?? [this.startState]).map((s) =>
      this.fa.getState(s.id)
    );
  }

  test(word: string) {
    return this.fa.check(word);
  }

  clone(newId = false) {
    const regex = new RegularExpression();

    regex.fa = this.fa.clone(newId);

    if (newId) {
      regex.startState = regex.fa.getState(
        regex.fa.newIdMapping.get(this.startState.id)!
      );

      regex.endStates = this.endStates.map((endState) =>
        regex.fa.getState(regex.fa.newIdMapping.get(endState.id)!)
      );
    } else {
      regex.startState = regex.fa.getState(this.startState.id);
      regex.endStates = this.endStates.map((endState) =>
        regex.fa.getState(endState.id)
      );
    }

    return regex;
  }

  static CONCAT<U extends string, V extends string>(params: {
    value: string[];
    args: [a: RegularExpression<U>, b: RegularExpression<V>];
  }) {
    const {
      args: [a, b],
      value,
    } = params;

    const regExA = a.clone(true);
    const regExB = b.clone(true);

    const fa = regExA.fa.merge(regExB.fa);

    const [startState] = fa.addState(
      new State({
        isStart: true,
      })
    );

    const endStates = fa.addState(
      new State({
        isAcceptState: true,
        value,
      })
    );

    fa.getState(regExA.startState.id).isStart = false;
    fa.getState(regExA.startState.id).isAcceptState = false;

    for (const endStateA of regExA.endStates) {
      fa.getState(endStateA.id).isStart = false;
      fa.getState(endStateA.id).isAcceptState = true;
    }

    fa.getState(regExB.startState.id).isStart = false;
    fa.getState(regExB.startState.id).isAcceptState = false;

    for (const endStateB of regExB.endStates) {
      fa.getState(endStateB.id).isStart = false;
      fa.getState(endStateB.id).isAcceptState = true;
    }

    const regex = new RegularExpression({
      fa,
      startState,
      endStates,
    });

    for (const endState of regExA.endStates) {
      fa.getState(endState.id).isAcceptState = false;
    }

    for (const endState of regExB.endStates) {
      fa.getState(endState.id).isAcceptState = false;
    }

    fa.addTransition(
      FiniteAutomata.EPSILON,
      startState.id,
      regExA.startState.id
    );

    for (const endStateA of regExA.endStates) {
      fa.addTransition(
        FiniteAutomata.EPSILON,
        endStateA.id,
        regExB.startState.id
      );
    }

    for (const endStateB of regExB.endStates) {
      fa.addTransition(FiniteAutomata.EPSILON, endStateB.id, endStates[0].id);
    }

    return regex;
  }

  static OR<U extends string, V extends string>(params: {
    args: [a: RegularExpression<U>, b: RegularExpression<V>];
  }) {
    const {
      args: [a, b],
    } = params;

    const regExA = a.clone(true);
    const regExB = b.clone(true);

    const fa = regExA.fa.merge(regExB.fa);

    const [startState] = fa.addState(
      new State({
        isStart: true,
      })
    );

    fa.getState(regExA.startState.id).isStart = false;
    fa.getState(regExA.startState.id).isAcceptState = false;

    for (const endStateA of regExA.endStates) {
      fa.getState(endStateA.id).isStart = false;
      fa.getState(endStateA.id).isAcceptState = true;
    }

    fa.getState(regExB.startState.id).isStart = false;
    fa.getState(regExB.startState.id).isAcceptState = false;

    for (const endStateB of regExB.endStates) {
      fa.getState(endStateB.id).isStart = false;
      fa.getState(endStateB.id).isAcceptState = true;
    }

    const regex = new RegularExpression({
      fa,
      startState,
      endStates: [...regExA.endStates, ...regExB.endStates].map((s) =>
        fa.getState(s.id)
      ),
    });

    fa.addTransition(
      FiniteAutomata.EPSILON,
      startState.id,
      regExA.startState.id,
      regExB.startState.id
    );

    return regex;
  }

  static STAR<U extends string>(params: {
    value: string[];
    args: [RegularExpression<U>];
  }) {
    const {
      args: [a],
      value,
    } = params;

    const regExA = a.clone(true);
    const fa = regExA.fa;

    fa.removeValues();

    const [startState] = fa.addState(
      new State({
        isStart: true,
      })
    );

    const endStates = fa.addState(
      new State({
        isAcceptState: true,
        value,
      })
    );

    fa.getState(regExA.startState.id).isStart = false;
    fa.getState(regExA.startState.id).isAcceptState = false;

    for (const endStateA of regExA.endStates) {
      fa.getState(endStateA.id).isStart = false;
      fa.getState(endStateA.id).isAcceptState = false;

      fa.addTransition(
        FiniteAutomata.EPSILON,
        endStateA.id,
        regExA.startState.id
      );

      fa.addTransition(FiniteAutomata.EPSILON, endStateA.id, endStates[0].id);
    }

    fa.addTransition(
      FiniteAutomata.EPSILON,
      startState.id,
      regExA.startState.id,
      endStates[0].id
    );

    const regex = new RegularExpression({
      fa,
      startState,
      endStates,
    });

    return regex;
  }

  static PLUS<U extends string>(params: {
    value: string[];
    args: [a: RegularExpression<U>];
  }) {
    const {
      args: [a],
      value,
    } = params;

    return RegularExpression.CONCAT({
      args: [
        a.clone(true),
        RegularExpression.STAR({
          args: [a],
          value,
        }),
      ],
      value,
    });
  }

  static #makeParts<U extends string, V extends string>(
    a: RegularExpression<U>,
    b: RegularExpression<V>,
    value: string[]
  ) {
    const regExA = a.clone(true);
    const regExB = b.clone(true);

    const fa = regExA.fa.merge(regExB.fa);

    const [startState] = fa.addState(
      new State({
        isStart: true,
      })
    );

    const endStates = fa.addState(
      new State({
        isAcceptState: true,
        value,
      })
    );

    fa.getState(regExA.startState.id).isStart = false;
    fa.getState(regExA.startState.id).isAcceptState = false;

    for (const endStateA of regExA.endStates) {
      fa.getState(endStateA.id).isStart = false;
      fa.getState(endStateA.id).isAcceptState = true;
    }

    fa.getState(regExB.startState.id).isStart = false;
    fa.getState(regExB.startState.id).isAcceptState = false;

    for (const endStateB of regExB.endStates) {
      fa.getState(endStateB.id).isStart = false;
      fa.getState(endStateB.id).isAcceptState = true;
    }

    const regex = new RegularExpression({
      fa,
      startState,
      endStates,
    });

    return {
      startState,
      endStates,
      regExA,
      regExB,
      regex,
      fa,
    };
  }

  static fromWord<U extends string>(word: string, value: U) {
    const regex = new RegularExpression<U>();

    const characters = word.split("");

    for (let i = 0; i < characters.length; i++) {
      regex.endStates[0].isAcceptState = false;
      const [nextState] = regex.fa.addState(new State());

      regex.fa.addTransition(characters[i], regex.endStates[0], nextState);
      regex.endStates[0] = nextState;
      regex.endStates[0].value = [value];
    }

    regex.endStates[0].isAcceptState = true;

    return regex;
  }

  static fromWords<U extends string>(words: Array<string>, value: U) {
    return words.map((word) => RegularExpression.fromWord(word, value));
  }
}
