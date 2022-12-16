import FiniteAutomata from "./FiniteAutomata";
import fs from "fs";
import { RegularExpression as re } from "./RegularExpression";
import {
  ALPHABET,
  DECLARATION_STATEMENT,
  UNDERSCORE,
} from "./RegularExpression/terminal";

enum Token {
  IF = "IF",
  FOR = "FOR",
  OR = "OR",
  STAR = "STAR",
  PLUS = "PLUS",
}

const IF = re.fromWord("if").value("IF");

// console.log(I);
// console.log(I.start);
// console.log(I.end);
// console.log(IF.check("if", 0));
const res = DECLARATION_STATEMENT.check("const   b = 1") ?? {};
fs.writeFileSync("./build/res.json", JSON.stringify(res, null, 2));

// fs.writeFileSync("./build/IF.json", JSON.stringify(IF.toJSON(), null, 2));
