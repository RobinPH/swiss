import { TestResultStatus } from "./BNF/BaseBNF";
import { toTable, toText } from "./BNF/formatter";
import { SWISS } from "./BNF/terminal/statement";
import { vizualize, vizualizeParseTree } from "./BNF/viz";
import { getCode, testInput } from "./cli/utility";
import { SyntaxAnalyzer } from "./SyntaxAnalyzer";

const main = async () => {
  const filepath = "./code/syntax_analyzer.sw";

  // const bnf = SWISS;
  // const res = await testInput(bnf, filepath);

  // console.log(res);

  const syntaxAnalyzer = new SyntaxAnalyzer(filepath);
  await syntaxAnalyzer.run();

  // toText("index.txt", res);

  // vizualizeParseTree(res.task.children[0]);

  // for (const b of [bnf]) {
  //   console.log(b.toDeclaration());
  // }
  // vizualize("res", bnf);
};

main();
