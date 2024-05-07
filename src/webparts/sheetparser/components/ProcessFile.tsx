import * as React from "react";

import { PrimaryButton, Spinner } from "@fluentui/react";
import processFile, { IJsonSpec, IResponse } from "../../utils/sheetparser";

interface IProcessFileProps {
  file: File | undefined;
  specification: IJsonSpec | undefined;
  setResult: (result: IResponse) => void;
}

export const ProcessFile: React.FunctionComponent<IProcessFileProps> = (
  props: IProcessFileProps
) => {
  const { file, specification, setResult } = props;
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(file: File | undefined): Promise<void> {
    if (!file) return;
    if (!specification) return;
    setLoading(true);
    console.log("FILE is named: " + file.name);
    const response = await processFile(file, specification);
    console.log(response);
    setResult(response);
    setLoading(false);
  }

  return (
    <div>
      <PrimaryButton onClick={() => handleSubmit(file)}>
        {loading ? <Spinner /> : "Validate"}
      </PrimaryButton>
    </div>
  );
};
