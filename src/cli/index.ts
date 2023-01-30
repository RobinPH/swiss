import fs from "node:fs";
import path from "node:path";
import { TestResultStatus } from "../BNF/BaseBNF";
import { toTable } from "../BNF/formatter";
import { SWISS } from "../BNF/terminal/statement";
import { getCode } from "./utility";

const main = async () => {
  if (process.argv.length < 3) {
    console.log("Usage: npm run swiss <filepath>");
    return;
  }

  const filepath = process.argv[2]!;

  if (!fs.existsSync(filepath)) {
    console.log(`File ${filepath} does not exist.`);
    return;
  }

  try {
    var code = getCode(filepath);
  } catch (e: any) {
    console.log(e.message);
    return;
  }

  const bnf = SWISS;
  console.log("Processing...");
  const result = await bnf.test(code);

  const filename = path.parse(path.basename(filepath)).name;
  const symbolTableFileName = `symbolTable.txt`;

  if (result.status === TestResultStatus.SUCCESS) {
    console.log("The program ran succesfully without lexical and syntax errors.");
  } else if (result.status === TestResultStatus.FAILED) {
    console.log(`[!] FAILED`);

    // const startOffest = 20;
    // const start = Math.max(0, result.range.to - startOffest);
    // const end = result.range.to + 40;
    // const segment = code.slice(start, end);
    // const snippet = segment.split("\n").join(" ");
    // const lineNumber = code.slice(0, result.range.to + 1).split("\n").length;
    // let columnNumber = 0;

    // for (let i = 0; i < result.range.to; i++) {
    //   if (code[i] === "\n") {
    //     columnNumber = 0;
    //     continue;
    //   }
    //   columnNumber++;
    // }
    // const prefix = `[Ln ${lineNumber}, Col ${columnNumber + 1}]:`;
    // console.log(`${prefix} ${snippet}`);
    // console.log(
    //   "".padStart(startOffest + lineNumber + prefix.length) +
    //     "^ Error started here"
    // );
  }

  toTable(symbolTableFileName, result);
};

main();
