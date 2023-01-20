import { TestResultStatus } from "./BNF/BaseBNF";
import { toTable } from "./BNF/formatter";
import { SWISS } from "./BNF/terminal/statement";
import { vizualize, vizualizeParseTree } from "./BNF/viz";
import { getCode } from "./cli/utility";

const main = async () => {
  const bnf = SWISS;
  const input = getCode("./code/index.sw");

  console.log("start");

  const res = await bnf.test(input);
  // vizualizeParseTree(res.task.children[0]);

  if (res.status === TestResultStatus.SUCCESS) {
    console.log("[?] SUCCESS");
  } else if (res.status === TestResultStatus.FAILED) {
    console.log(`[!] Failed`);
  }

  console.log(res.range);

  toTable("symbol_table.txt", res);

  for (const b of [bnf]) {
    console.log(b.toDeclaration());
  }
  // vizualize("res", bnf);
};

main();
