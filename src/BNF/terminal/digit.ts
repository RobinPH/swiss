import { ATOM, OR } from "..";

const digit = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
const digit_nonzero = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

export const DIGIT = OR(...digit.map((ch) => ATOM(ch).name(ch).hide())).name(
  "DIGIT"
);

export const DIGIT_NONZERO = OR(
  ...digit_nonzero.map((ch) => ATOM(ch).name(ch).hide())
).name("DIGIT_NONZERO");
