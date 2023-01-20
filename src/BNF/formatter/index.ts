import fs from "node:fs";
import path from "node:path";
import BaseBNF, { TestResult, TestResultStatus } from "../BaseBNF";

const PATH = "./result";

type Result = TestResult<any, any> & { input: string };

const CHARACTER_MAPPING = {
  // "\n": "\\n",
  // "\r": "\\r",
  "\n": "",
  "\r": "",
} as const;

const getTextFromInput = (
  input: string,
  range: { from: number; to: number }
) => {
  const mapped = input
    .slice(range.from, range.to)
    .split("")
    .map((c) => {
      if (c in CHARACTER_MAPPING) {
        // @ts-ignore
        return CHARACTER_MAPPING[c];
      }
      return c;
    })
    .join("");

  const MAX_LENGTH = 20;

  if (mapped.length > MAX_LENGTH) {
    return mapped.slice(0, MAX_LENGTH) + "...";
  }

  return mapped;
};

export const toText = (filepath: string, result?: Result) => {
  const output = new Array<string>();

  const makeOutput = (result: TestResult<any, any>, depth = 0) => {
    const prefix = "".padStart(depth, "\t");

    output.push(
      `${prefix}"${result.name}" ${result.range.from}:${result.range.to}${
        result.isToken ? " TOKEN" : ""
      }`
    );

    for (const subValue of result.children) {
      makeOutput(subValue, depth + 1);
    }
  };

  if (result && result.status === TestResultStatus.SUCCESS) {
    makeOutput(result);
  }

  save(filepath, output.join("\n"));
};

export const toJson = (filepath: string, result?: Result) => {
  if (!result || result.status === TestResultStatus.FAILED) {
    save(filepath, JSON.stringify({}, null, 2));
    return;
  }

  const removeKeys = <U extends string>(
    obj: TestResult<any, any>,
    keys: Array<U>
  ): Omit<TestResult<any, any>, U> => {
    for (const key of keys) {
      // @ts-ignore
      delete obj[key];
    }

    for (const subValue of obj.children) {
      removeKeys(subValue, keys);
    }

    return obj;
  };

  save(
    filepath,
    JSON.stringify(
      removeKeys(result, ["machine", "status", "charLength"]) ?? {},
      null,
      2
    )
  );
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

  const process = (res: TestResult<any, any>) => {
    if (res.children.length === 0 || res.isToken) {
      if (res.isHidden || res.range.from === res.range.to) {
        return;
      }

      rows.push({
        lexeme: "TEXT",
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

  const headers = ["ID", "Lexeme", "Token", "Range"];

  const table = [
    headers,
    ...rows.map((row, index) => {
      return [
        `${index}`,
        `${getTextFromInput(result!.input, row.range)}`,
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
