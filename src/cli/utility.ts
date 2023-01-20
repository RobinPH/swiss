import fs from "node:fs";

export const getCode = (filepath: string) => {
  if (!fs.existsSync(filepath)) {
    console.log(`File ${filepath} does not exist.`);
    return "";
  }

  const code = fs.readFileSync(filepath, "utf-8").replaceAll("\r", "");

  return code;
};
