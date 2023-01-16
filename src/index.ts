import { TestResultStatus } from "./BNF/BaseBNF";
import { toTable, toText } from "./BNF/formatter";
import {
  EXPRESSION,
  UNARY_EXPRESSION,
  VALUE2,
} from "./BNF/terminal/statement/expression";
import { MULTI_LINE_COMMENT } from "./BNF/terminal/multipleLineComment";
import { UNARY_OPERATORS } from "./BNF/terminal/operator/unary";
import { vizualize } from "./BNF/viz";
import {
  ASSIGNMENT_STATEMENT,
  CODE_BLOCK,
  FOR_STATEMENT,
  IF_STATEMENT,
} from "./BNF/terminal/statement";
import { IDENTIFIER } from "./BNF/terminal/identifier";
import { ATOM, CONCAT, OR } from "./BNF";

const bnf = CODE_BLOCK;
const input = `{
  const a = 1;
  let b = 3.141519;
  constant c = "HELLO WORLD!";

  ++a;

  b += 1;
  const e = 2 * (1 + 2);
  b **= e;

  if (a < 1) {
    const d = 1;
  }

  for(let i = 0; i < 5; i++) {
    const a = 1;
  }
}`;

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

// @ts-ignore
// vizualize("res", bnf);
