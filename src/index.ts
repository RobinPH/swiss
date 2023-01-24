import { TestResultStatus } from "./BNF/BaseBNF";
import { toTable } from "./BNF/formatter";
import { SWISS } from "./BNF/terminal/statement";
import { vizualize, vizualizeParseTree } from "./BNF/viz";
import { getCode } from "./cli/utility";

const main = async () => {
  try {
    var code = getCode("./code/testFile.sw");
  } catch (e: any) {
    console.log(e.message);
    return;
  }

  const bnf = SWISS;

  console.log("Processing...");

  const res = await bnf.test(code);
  // vizualizeParseTree(res.task.children[0]);

  if (res.status === TestResultStatus.SUCCESS) {
    console.log("[?] SUCCESS");
  } else if (res.status === TestResultStatus.FAILED) {
    console.log(`[!] Failed`);
  }

  // console.log(res.range);

  toTable("symbol_table.txt", res);

  // for (const b of [bnf]) {
  //   console.log(b.toDeclaration());
  // }
  // vizualize("res", bnf);
};

main();
