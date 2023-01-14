import { ATOM, CONCAT, STAR } from "../..";
import { ALPHABET } from "../alphabet";

export const STRING = CONCAT(
  ATOM("'").name("STRING_OPENING_QUOTE").token(),
  STAR(ALPHABET).name("STRING_LITERAL").token(),
  ATOM("'").name("STRING_CLOSING_QUOTE").token()
).name("STRING");
