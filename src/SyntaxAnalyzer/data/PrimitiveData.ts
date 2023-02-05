import { PrimitiveDataType } from "./types";
import { VariableValueData } from "./VariableValueData";

export type PrimitiveMetadata = {
  rawValue?: string;
  nullable: boolean;
};

export abstract class PrimitiveData<
  T extends PrimitiveDataType,
  U
> extends VariableValueData<T, {}, U> {
  static isValidValue(rawValue: string) {
    return false;
  }
}
