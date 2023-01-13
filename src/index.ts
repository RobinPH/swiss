import BNF from "./BNF";
import { TestResultStatus } from "./BNF/BaseBNF";
import { toTable } from "./BNF/formatter";
import { ASSIGNMENT_OPERATORS } from "./BNF/terminal/operator/assignment";
import { BITWISE_OPERATORS } from "./BNF/terminal/operator/bitwise";
import { DECLARATION_STATEMENT } from "./BNF/terminal/statement";
import { ARRAY, ARRAY_ADDITIONAL_VALUE, VALUE } from "./BNF/terminal/value";
import { vizualize } from "./BNF/viz";
const { ATOM, CONCAT, OPTIONAL, STAR, OR } = BNF;

const bnf = DECLARATION_STATEMENT;
const input = `const a_0 = [1];`;

const res = bnf.test(input);

if (res.status === TestResultStatus.SUCCESS) {
  console.log("[?] SUCCESS");
} else if (res.status === TestResultStatus.FAILED) {
  console.log(`[!] Failed`);
}

toTable("symbol_table.txt", res);

for (const b of [bnf]) {
  console.log(b.toDeclaration());
}
vizualize("res", bnf);
