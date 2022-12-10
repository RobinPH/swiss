import FiniteAutomata, { State } from "../../FiniteAutomata";

const fa1 = new FiniteAutomata();

fa1.addState(
  new State({
    id: "q0",
    value: ["FOO"],
    isStart: true,
  })
);

fa1.addState(
  new State({
    id: "q1",
    value: ["BAR"],
    isAcceptState: true,
  })
);

fa1.addState(
  new State({
    id: "q2",
    value: ["CAT"],
    isAcceptState: true,
  })
);

fa1.addTransition("0", "q0", "q0", "q1");
fa1.addTransition("1", "q0", "q0");
fa1.addTransition("2", "q0", "q2");

fa1.addTransition("1", "q1", "q2");

fa1.addTransition("0", "q2", "q0", "q2");
fa1.addTransition("1", "q2", "q0", "q1");
fa1.addTransition("2", "q2", "q0");

const dfa1 = fa1.fromNFAToDFA();

test("Alphabet", () => {
  expect(Array.from(dfa1.alphabet)).toStrictEqual(["0", "1", "2"]);
});

test("State", () => {
  expect(dfa1.states.size).toBe(5);
  expect(Array.from(dfa1.states.keys()).sort()).toStrictEqual(
    ["q0", "q2", "q0-q1", "q0-q2", "q0-q1-q2"].sort()
  );
});

test("Transitions", () => {
  const transitions = dfa1.transitions;

  const checkState = (id: string, expect: Record<string, string[]>) => {
    const transition = transitions.get(id)!;

    if (!transition) {
      return false;
    }

    for (const [symbol, states] of Object.entries(expect)) {
      const to = transition.get(symbol);

      if (!to) {
        return false;
      }

      if (states.length !== to.length) {
        return false;
      }

      if (!states.every((state) => to.find((s) => s.id === state))) {
        return false;
      }
    }
    return true;
  };

  const checks = [
    {
      id: "q0",
      transitions: {
        "0": ["q0-q1"],
        "1": ["q0"],
        "2": ["q2"],
      },
    },
    {
      id: "q2",
      transitions: {
        "0": ["q0-q2"],
        "1": ["q0-q1"],
        "2": ["q0"],
      },
    },
    {
      id: "q0-q1",
      transitions: {
        "0": ["q0-q1"],
        "1": ["q0-q2"],
        "2": ["q2"],
      },
    },
    {
      id: "q0-q2",
      transitions: {
        "0": ["q0-q1-q2"],
        "1": ["q0-q1"],
        "2": ["q0-q2"],
      },
    },
    {
      id: "q0-q1-q2",
      transitions: {
        "0": ["q0-q1-q2"],
        "1": ["q0-q1-q2"],
        "2": ["q0-q2"],
      },
    },
  ];

  expect(
    checks.every(({ id, transitions }) => checkState(id, transitions))
  ).toBe(true);
});
