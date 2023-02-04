import { BaseData } from "./BaseData";
import { DATA_TYPES } from "./types";

export class StringData extends BaseData<string> {
  constructor(identifier: string, rawValue: string) {
    super(DATA_TYPES.STRING, identifier, rawValue);
  }

  parseValue(rawValue: string): string {
    return rawValue;
  }
}
