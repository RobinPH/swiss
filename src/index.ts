import BNF from "./BNF";
import { TestResultStatus } from "./BNF/BaseBNF";
import { toCsv } from "./BNF/formatter";
import { DECLARATION_STATEMENT } from "./BNF/terminal/statement";
import { vizualize } from "./BNF/viz";
const { ATOM, CONCAT, OPTIONAL } = BNF;

const bnf = DECLARATION_STATEMENT;
const input = `const x = 1.0;`;
const res = bnf.test(input);

if (res.status === TestResultStatus.SUCCESS) {
  console.log("[?] SUCCESS");
} else if (res.status === TestResultStatus.FAILED) {
  console.log(`[!] Failed`);
}

toCsv("res.csv", res);
console.log(bnf.toDeclaration());
// vizualize("res", bnf);
