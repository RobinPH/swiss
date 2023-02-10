import fs from "node:fs";
import path from "node:path";
import { Result } from "..";
import { getTextFromInput } from "./utility";

const PATH = "./result";

export const toText = (filepath: string, result?: Result) => {
  const output = new Array<string>();

  const makeOutput = (result: Result, depth = 0) => {
    const prefix = "".padStart(depth, "\t");

    output.push(
      `${prefix}"${result.name}" ${result.input} ${result.range.from}:${
        result.range.to
      }${result.isToken ? " TOKEN" : ""}`
    );

    for (const subValue of result.children) {
      makeOutput(subValue, depth + 1);
    }
  };

  // if (result && result.status === TestResultStatus.SUCCESS) {
  if (result) {
    makeOutput(result);
  }

  save(filepath, output.join("\n"));
};

export const toTable = (filepath: string, result?: Result) => {
  const rows = new Array<{
    token: string;
    lexeme: string;
    range: {
      from: number;
      to: number;
    };
  }>();

  const process = (res: Result) => {
    if (res.children.length === 0 || res.isToken) {
      // if (res.isHidden || res.range.from === res.range.to) {
      if (res.range.from === res.range.to) {
        return;
      }

      rows.push({
        lexeme: res.input,
        token: res.name,
        range: res.range,
      });
    } else {
      for (const subValue of res.children) {
        process(subValue);
      }
    }
  };

  if (result) {
    process(result);
  }

  console.log("asdasd");

  const headers = ["ID", "Lexeme", "Token", "Range"];

  const table = [
    headers,
    ...rows.map((row, index) => {
      return [
        `${index}`,
        `${row.lexeme}`,
        row.token,
        `${row.range.from}:${row.range.to}`,
      ];
    }),
  ];

  const mxLength = new Array<number>();

  for (let i = 0; i < headers.length; i++) {
    let len = 0;
    for (let j = 0; j < table.length; j++) {
      len = Math.max(len, table[j][i].length);
    }
    mxLength.push(len);
  }

  const GAP = 4;

  save(
    filepath,
    table
      .map((row) => {
        return row
          .map((cell, index) => {
            return cell.padEnd(mxLength[index], " ");
          })
          .join("".padStart(GAP, " "));
      })
      .join("\n")
  );
};

const save = (filepath: string, data: string) => {
  if (!fs.existsSync(PATH)) {
    fs.mkdirSync(PATH);
  }

  fs.writeFileSync(path.join(PATH, filepath), data);
};
