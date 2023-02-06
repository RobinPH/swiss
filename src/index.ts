import { TestResultStatus } from "./BNF/BaseBNF";
import { toTable, toText } from "./BNF/formatter";
import { SWISS } from "./BNF/terminal/statement";
import { vizualize, vizualizeParseTree } from "./BNF/viz";
import { getCode, testInput } from "./cli/utility";
import { SyntaxAnalyzer } from "./SyntaxAnalyzer";

const main = async () => {
  const filepath = "./code/testFile.sw";

  const res = await testInput(filepath);
};

main();
