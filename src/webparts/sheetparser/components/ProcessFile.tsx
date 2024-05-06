import * as React from "react";

import processFile, { IJsonSpec, IResponse } from "../../utils/sheetparser";

import { PrimaryButton } from "@fluentui/react";

interface IProcessFileProps {
  file: File | undefined;
  specification: IJsonSpec | undefined;
  setResult: (result: IResponse) => void;
}

export const ProcessFile: React.FunctionComponent<IProcessFileProps> = (
  props: IProcessFileProps
) => {
  const { file, specification, setResult } = props;

  async function handleSubmit(file: File | undefined): Promise<void> {
    if (!file) return;
    if (!specification) return;
    console.log("FILE is named: " + file.name);
    const response = await processFile(file, specification);
    console.log(response);
    setResult(response);
  }

  return (
    <div>
      <PrimaryButton onClick={() => handleSubmit(file)}>Validate</PrimaryButton>
    </div>
  );
};
