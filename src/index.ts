import BNF from "./BNF";
import { TestResultStatus } from "./BNF/BaseBNF";
import { toCsv } from "./BNF/formatter";
import {
  ARRAY,
  ARRAY_ADDITIONAL_VALUE,
  ARRAY_VALUE,
  VALUE,
} from "./BNF/terminal/value";
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

toCsv("res.csv", res);

for (const b of [VALUE, ARRAY_ADDITIONAL_VALUE, ARRAY_VALUE, ARRAY]) {
  console.log(b.toDeclaration());
}
vizualize("res", bnf);
