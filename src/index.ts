import FiniteAutomata from "./FiniteAutomata";
import { toCsv, toJson, toText } from "./FiniteAutomata/format";
import { DECLARATION_STATEMENT, VALUE } from "./FiniteAutomata/terminal";
import { vizualize } from "./FiniteAutomata/viz";
const { ATOM, OR, WORD } = FiniteAutomata;

const res = DECLARATION_STATEMENT.check(`const boolean a = 5;`);


toCsv("res.csv", res);
// vizualize("res", DECLARATION_STATEMENT);
