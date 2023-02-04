import { BaseData } from "./BaseData";
import { DATA_TYPES } from "./types";

export class IntegerData extends BaseData<number> {
  constructor(identifier: string, rawValue: string) {
    super(DATA_TYPES.INTEGER, identifier, rawValue);
  }

  parseValue(rawValue: string): number {
    return Math.floor(parseInt(rawValue));
  }
}
