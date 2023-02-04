import { BaseData } from "./BaseData";
import { DATA_TYPES } from "./types";

type FunctionValue = {
  parameters: string[];
};

export class FunctionData extends BaseData<FunctionValue> {
  constructor(identifier: string, rawValue: string) {
    super(DATA_TYPES.FUNCTION, identifier, rawValue);
  }

  parseValue(rawValue: string): FunctionValue {
    return {
      parameters: [],
    };
  }
}
