import { testInput } from "./cli/utility";

const main = async () => {
  const filepath = "./code/conditional_statement.sw";

  const res = await testInput(filepath);

  // const declarations = FINALLY_STATEMENT.getAllDeclaration();

  // for (const declaration of declarations) {
  //   console.log(declaration);
  // }
};

main();
