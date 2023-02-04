import { BaseData } from "./BaseData";
import { DATA_TYPES } from "./types";

export class ClassData extends BaseData<string> {
  constructor(identifier: string, rawValue: string) {
    super(DATA_TYPES.CLASS, identifier, rawValue);
  }

  parseValue(rawValue: string): string {
    return rawValue;
  }
}
