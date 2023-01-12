import BNF from "..";

const { ATOM } = BNF;

export const UNDERSCORE = ATOM("_").name("UNDERSCORE");

export const SEMICOLON = ATOM(";").name("SEMICOLON").token();
