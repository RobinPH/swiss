import { TestResultStatus } from "./BNF/BaseBNF";
import { toTable } from "./BNF/formatter";
import { SWISS } from "./BNF/terminal/statement";
import { vizualize, vizualizeParseTree } from "./BNF/viz";
import { getCode, testInput } from "./cli/utility";

const main = async () => {
  const filepath = "./code/testFile.sw";

  const bnf = SWISS;
  const res = await testInput(bnf, filepath);

  // vizualizeParseTree(res.task.children[0]);

  // for (const b of [bnf]) {
  //   console.log(b.toDeclaration());
  // }
  // vizualize("res", bnf);
};

main();
