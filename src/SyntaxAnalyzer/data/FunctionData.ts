import { BaseData, DataMetadata } from "./BaseData";
import { FunctionParameterData } from "./FunctionParameterData";
import { DataType } from "./types";

type FunctionMetadata = {
  parameters: FunctionParameterData[];
};

export class FunctionData extends BaseData<FunctionMetadata> {
  constructor(metadata: Omit<DataMetadata & FunctionMetadata, "type">) {
    super({
      ...metadata,
      type: DataType.FUNCTION,
    });
  }
}
