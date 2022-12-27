import fs from "node:fs";
import FiniteAutomata from "./FiniteAutomata";
import { DECLARATION_STATEMENT } from "./FiniteAutomata/terminal";
const { ATOM, OR } = FiniteAutomata;

const A = ATOM("A").setValue("A").cloneable(false);
const B = ATOM("B").setValue("B").cloneable(false);

const AB = OR(B, A).setValue("AB");
const BA = OR(A, B).setValue("BA");

const res = BA.check("A");

console.log(res);

fs.writeFileSync(
  "./build/res.json",
  // @ts-ignore
  // JSON.stringify(res, null, 2)
  FiniteAutomata.formatResult(res).join("\n")
);
