import fs from "node:fs";
import { testInput } from "./utility";

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

  await testInput(filepath);
};

main();
