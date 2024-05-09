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
    const response = await processFile(file, specification);
    setResult(response);
    setLoading(false);
  }

  return (
    <PrimaryButton onClick={() => handleSubmit(file)}>
      {loading ? <Spinner /> : "Validate"}
    </PrimaryButton>
  );
};
