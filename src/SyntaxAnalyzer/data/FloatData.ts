import { BaseData } from "./BaseData";
import { DATA_TYPES } from "./types";

export class FlaotData extends BaseData<number> {
  constructor(identifier: string, rawValue: string) {
    super(DATA_TYPES.FLOAT, identifier, rawValue);
  }

  parseValue(rawValue: string): number {
    return parseFloat(rawValue);
  }
}
