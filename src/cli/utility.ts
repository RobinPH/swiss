import fs from "node:fs";
import path from "node:path";
import BaseBNF, { TestResultStatus } from "../BNF/BaseBNF";
import { toTable } from "../BNF/formatter";

const EXTENSION = ".sw";

export const getCode = (filepath: string) => {
  if (!fs.existsSync(filepath)) {
    throw new Error(`File ${filepath} does not exist.`);
  }

  const ext = path.parse(path.basename(filepath)).ext;

  if (ext !== EXTENSION) {
    throw new Error(`${filepath} is not a valid ${EXTENSION} file`);
  }

  const code = fs.readFileSync(filepath, "utf-8").replaceAll("\r", "");

  return code;
};

export const testInput = async (
  bnf: BaseBNF<any, any[], any>,
  filepath: string
) => {
  try {
    var code = getCode(filepath);
  } catch (e: any) {
    console.log(e.message);
    return;
  }

  console.log("Processing...");
  const result = await bnf.test(code);

  const filename = path.parse(path.basename(filepath)).name;
  const symbolTableFileName = `${filename}.symbol`;

  if (result.status === TestResultStatus.SUCCESS) {
    console.log("[✓] Lexical Analyzer SUCCESS");
  } else if (result.status === TestResultStatus.FAILED) {
    console.log(`[!] Lexical Analyzer FAILED`);

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

  return result;
};
