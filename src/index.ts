import fs from "node:fs";
import FiniteAutomata from "./FiniteAutomata";
import { DECLARATION_STATEMENT } from "./FiniteAutomata/terminal";

const res = DECLARATION_STATEMENT.check("constant a = 1");

fs.writeFileSync(
  "./build/res.json",
  // @ts-ignore
  // JSON.stringify(res, null, 2)
  FiniteAutomata.formatResult(res).join("\n")
);
