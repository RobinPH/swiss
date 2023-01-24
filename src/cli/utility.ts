import fs from "node:fs";
import path from "node:path";

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
