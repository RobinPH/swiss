import { TestResultStatus } from "./BNF/BaseBNF";
import { toTable } from "./BNF/formatter";
import { SWISS } from "./BNF/terminal/statement";
import * as fs from 'fs';

var read = fs.readFileSync('./src/index.sw', 'utf8');

const bnf = SWISS;
const input = read;

const res = bnf.test(input);

if (res.status === TestResultStatus.SUCCESS) {
  console.log("[?] SUCCESS");
} else if (res.status === TestResultStatus.FAILED) {
  console.log(`[!] Failed`);
}

toTable("symbol_table.txt", res);

/*for (const b of [bnf]) {
  console.log(b.toDeclaration());
}*/

// @ts-ignore
// vizualize("res", bnf);
