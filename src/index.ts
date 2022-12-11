import { DECLARATION_STATEMENT } from "./RegularExpression/terminal";

console.log(DECLARATION_STATEMENT.check("constant   a   =  1")?.value);
