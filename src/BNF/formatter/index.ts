import fs from "node:fs";
import path from "node:path";
import BaseBNF, { TestResult, TestResultStatus } from "../BaseBNF";

const PATH = "./result";

type Result = TestResult<any, any> & { input: string };

const getTextFromInput = (
  input: string,
  range: { from: number; to: number }
) => {
  return input.slice(range.from, range.to);
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

export const toCsv = (filepath: string, result?: Result) => {
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

  if (result && result.status === TestResultStatus.SUCCESS) {
    process(result);
  }

  const headers = ["ID", "Lexeme", "Token", "Range"];

  const csv = [
    headers.join(","),
    ...rows.map((row, index) => {
      const cells = [
        `${index}`,
        `"${getTextFromInput(result!.input, row.range)}"`,
        `"${row.token}"`,
        `${row.range.from}:${row.range.to}`,
      ];

      return cells.map((cell) => cell.replace(",", `","`));
    }),
  ].join("\n");

  save(filepath, csv);
};

const save = (filepath: string, data: string) => {
  if (!fs.existsSync(PATH)) {
    fs.mkdirSync(PATH);
  }

  fs.writeFileSync(path.join(PATH, filepath), data);
};
