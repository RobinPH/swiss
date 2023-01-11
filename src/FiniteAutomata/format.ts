import { CheckResult } from ".";
import fs from "node:fs";
import path from "node:path";

const PATH = "./result";

export const toText = (filepath: string, result?: CheckResult<any, any>) => {
  const output = new Array<string>();

  const makeOutput = (result: CheckResult<any, any>, depth = 0) => {
    const prefix = "".padStart(depth, "\t");

    output.push(
      `${prefix}"${result.value}" ${result.from}:${result.to}${
        result.token ? " TOKEN" : ""
      }`
    );

    for (const subValue of result.subValues) {
      makeOutput(subValue, depth + 1);
    }
  };

  if (result) {
    makeOutput(result);
  }

  save(filepath, output.join("\n"));
};

export const toJson = (filepath: string, result?: CheckResult<any, any>) => {
  if (!result) {
    save(filepath, JSON.stringify({}, null, 2));
    return;
  }

  const removeKeys = <U extends string>(
    obj: CheckResult<any, any>,
    keys: Array<U>
  ): Omit<CheckResult<any, any>, U> => {
    for (const key of keys) {
      // @ts-ignore
      delete obj[key];
    }

    for (const subValue of obj.subValues) {
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

export const toCsv = (filepath: string, result?: CheckResult<any, any>) => {
  const rows = new Array<{
    token: string;
    lexeme: string;
    range: {
      from: number;
      to: number;
    };
  }>();

  const process = (res: CheckResult<any, any>) => {
    if (res.subValues.length === 0 || res.machine.isToken()) {
      rows.push({
        lexeme: res.text,
        token: res.value,
        range: {
          from: res.from,
          to: res.to,
        },
      });
    } else {
      for (const subValue of res.subValues) {
        process(subValue);
      }
    }
  };

  if (result) {
    process(result);
  }

  const headers = ["ID", "Lexeme", "Token", "Range"];

  const csv = [
    headers.join(","),
    ...rows.map((row, index) => {
      const cells = [
        `${index}`,
        `"${row.lexeme}"`,
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
