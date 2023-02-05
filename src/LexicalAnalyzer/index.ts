import path from "path";
import { TestResultStatus } from "../BNF/BaseBNF";
import { toTable } from "../BNF/formatter";
import { SWISS } from "../BNF/terminal/statement";
import { getCode } from "../cli/utility";

export class LexicalAnalyzer {
  readonly filepath: string;
  #bnf = SWISS;

  constructor(filepath: string) {
    this.filepath = filepath;
  }

  async run() {
    try {
      var code = getCode(this.filepath);
    } catch (e: any) {
      console.log(e.message);
      return;
    }

    console.log("Processing...");
    const result = await this.#bnf.test(code);

    const filename = path.parse(path.basename(this.filepath)).name;
    const symbolTableFileName = `${filename}.symbol`;

    if (result.status === TestResultStatus.SUCCESS) {
      console.log("[✓] Lexical Analyzer SUCCESS");
    } else if (result.status === TestResultStatus.FAILED) {
      console.log(`[!] Lexical Analyzer FAILED`);
    }

    toTable(symbolTableFileName, result);

    return result;
  }
}
