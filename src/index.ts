import { TestResultStatus } from "./BNF/BaseBNF";
import { toTable } from "./BNF/formatter";
import { MULTI_LINE_COMMENT } from "./BNF/terminal/multipleLineComment";
import { vizualize } from "./BNF/viz";

const bnf = MULTI_LINE_COMMENT;
const input = `###dsdd##xx###`;

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
// vizualize("res", bnf);
