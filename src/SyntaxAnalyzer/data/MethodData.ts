import { BaseData, DataMetadata } from "./BaseData";
import { MethodParameterData } from "./MethodParameterData";
import { DataType } from "./types";

type MethodMetadata = {
  parameters: MethodParameterData[];
};

export class MethodData extends BaseData<MethodMetadata> {
  constructor(metadata: Omit<DataMetadata & MethodMetadata, "type">) {
    super({
      ...metadata,
      type: DataType.FUNCTION,
    });
  }
}
