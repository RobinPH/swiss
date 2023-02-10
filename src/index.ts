import { CONCAT, FiniteStateMachine, OR, WORD } from "./FSM";
import { toTable, toText } from "./FSM/formatter";
import { DECLARATOR } from "./FSM/terminal/declarator";
import { IDENTIFIER } from "./FSM/terminal/identifier";
import { DATATYPE_SPECIFIER } from "./FSM/terminal/keyword";
import {
  ASSIGNMENT_OPERATOR,
  ASSIGNMENT_OPERATORS,
} from "./FSM/terminal/operator/assignment";
import { DECLARATION_STATEMENT } from "./FSM/terminal/statement/declaration";
import { VALUE } from "./FSM/terminal/value";
import { vizualize } from "./FSM/viz";

const main = async () => {
  // const filepath = "./code/syntax_analyzer.sw";

  // const res = await testInput(filepath);

  const A = WORD("a").value("A");
  const B = WORD("b").value("B");
  const C = WORD("c").value("C");
  const D = WORD("d").value("D");
  const AB = CONCAT(A, B).value("AB");
  const CD = CONCAT(C, D).value("CD");
  const ABCD = OR(AB, CD).value("AB_CD");

  console.log("start");
  const fsm = DECLARATION_STATEMENT;

  const start = performance.now();

  console.log("to nfa");
  const nfa = fsm.toNFA();
  console.log(performance.now() - start);
  console.log("to dfa");
  const dfa = nfa.toDFA();
  console.log("dfa");
  console.log(performance.now() - start);

  const bnf = dfa;

  console.log(fsm.getInfo().machines.size);
  console.log(nfa.getInfo().machines.size);
  console.log(dfa.getInfo().machines.size);

  const e = FiniteStateMachine.EPSILON;

  // const res = bnf.test("");

  // if (res) {
  //   toText("fsm", res);
  // } else {
  //   console.log("failed");
  // }

  // vizualize("fsm", fsm);
  // vizualize("nfa", nfa);
  // vizualize("dfa", dfa);
};

main();
