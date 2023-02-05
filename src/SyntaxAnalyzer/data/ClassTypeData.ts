import { VariableValueData } from "./VariableValueData";

export class ClassTypeData extends VariableValueData<"CLASS_TYPE", {}, any> {
  constructor(
    metadata: ConstructorParameters<
      typeof VariableValueData<"CLASS_TYPE", {}, any>
    >[1]
  ) {
    super("CLASS_TYPE", metadata);
  }

  isValidValue(rawValue: string): boolean {
    return true;
  }

  _parseValue(rawValue: string) {
    return "";
  }
}
