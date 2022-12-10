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
  })
);

fa1.addState(
  new State({
    id: "q2",
    value: ["CAT"],
  })
);

fa1.addState(
  new State({
    id: "q3",
    value: ["CAT"],
    isAcceptState: true,
  })
);

fa1.addState(
  new State({
    id: "q4",
    value: ["CAT"],
  })
);

fa1.addState(
  new State({
    id: "q5",
    value: ["CAT"],
  })
);

fa1.addTransition(FiniteAutomata.EPSILON, "q0", "q1");
fa1.addTransition("0", "q0", "q0");

fa1.addTransition(FiniteAutomata.EPSILON, "q1", "q3");
fa1.addTransition("0", "q1", "q2");

fa1.addTransition(FiniteAutomata.EPSILON, "q2", "q5");
fa1.addTransition("1", "q2", "q1");

fa1.addTransition(FiniteAutomata.EPSILON, "q3", "q4");
fa1.addTransition("1", "q3", "q3");

fa1.addTransition("0", "q4", "q4");
fa1.addTransition("1", "q4", "q3");

fa1.addTransition(FiniteAutomata.EPSILON, "q5", "q3");
fa1.addTransition("0", "q5", "q0");
fa1.addTransition("1", "q5", "q5");

const nfa1 = fa1.fromEpsilonNFAToNFA();

test("Alphabet", () => {
  expect(Array.from(nfa1.alphabet)).toStrictEqual([
    FiniteAutomata.EPSILON,
    "0",
    "1",
  ]);
});
