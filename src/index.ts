import BNF from "./BNF";
import { TestResultStatus } from "./BNF/BaseBNF";
import { toTable } from "./BNF/formatter";
import { ARRAY, ARRAY_ADDITIONAL_VALUE, VALUE } from "./BNF/terminal/value";
import { vizualize } from "./BNF/viz";
const { ATOM, CONCAT, OPTIONAL, STAR, OR } = BNF;

const bnf = ARRAY;
const input = `[[[[32]]], 1.01, 'string']`;

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
