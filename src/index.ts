import fs from "node:fs";
import FiniteAutomata from "./FiniteAutomata";

import { RegularExpression as re } from "./RegularExpression";
import { IDENTIFIER, WHITESPACE } from "./RegularExpression/terminal";
const { ATOM, OR, CONCAT, PLUS, STAR, OPTIONAL } = re;

const ITEM = IDENTIFIER.label("ITEM");
const OPENING_BRACKET = ATOM("[").label("OPENING_BRACKET");
const ITEM_DELIMITER = ATOM(",").label("ITEM_DELIMITER");
const CLOSING_BRACKET = ATOM("]").label("CLOSING_BRACKET");

const ARRAY = CONCAT(
  OPENING_BRACKET,
  WHITESPACE,
  OPTIONAL(
    CONCAT(
      CONCAT(ITEM, WHITESPACE).label("ITEM"),
      STAR(
        CONCAT(ITEM_DELIMITER, WHITESPACE, ITEM, WHITESPACE).label("EXTRA_ITEM")
      ).label("...ITEMS"),
      WHITESPACE
    ).label("ITEMS")
  ),
  CLOSING_BRACKET
).label("ARRAY");

const res = ARRAY.check("[ a , _b, c, _dad21a  ]");

fs.writeFileSync(
  "./build/res.txt",
  // @ts-ignore
  FiniteAutomata.formatResult(res).join("\n")
);
