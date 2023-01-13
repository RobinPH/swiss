import BNF from "..";
import { ALPHABET } from "./alphabet";
import { DIGIT } from "./digit";
import { SPECIAL_CHARACTER } from "./specialCharacter";
import { WHITESPACE } from "./whitespace";

const { OR } = BNF;

export const CHARACTER = OR(
    ALPHABET, DIGIT, SPECIAL_CHARACTER, WHITESPACE
  ).name("CHARACTER").token();