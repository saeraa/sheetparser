import { IJsonSpec, IResponse } from "../../utils/sheetparser";

import { ISheetparserProps } from "./ISheetparserProps";
import { ProcessFile } from "./ProcessFile";
import React from "react";
import { SpecificationOptions } from "./SpecificationOptions";
import { Stack } from "@fluentui/react";
import { Upload } from "./Upload";
import { ValidationError } from "./ValidationError";
import { ValidationSuccess } from "./ValidationSuccess";
import styles from "./Sheetparser.module.scss";

const Sheetparser: React.FC<ISheetparserProps> = ({
  hasTeamsContext,
}: ISheetparserProps) => {
  const [file, setFile] = React.useState<File | undefined>();
  const [specification, setSpecification] = React.useState<
    IJsonSpec | undefined
  >();
  const [result, setResult] = React.useState<IResponse>();

  const hasResult: boolean =
    result !== undefined && result.success !== undefined;

  return (
    <section
      className={`${styles.sheetparser} ${hasTeamsContext ? styles.teams : ""}`}
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <Stack.Item>
          <Upload setFile={setFile} />
        </Stack.Item>
        <Stack.Item>
          <SpecificationOptions setSpecification={setSpecification} />
        </Stack.Item>
        <Stack.Item>
          <ProcessFile
            file={file ? file : undefined}
            specification={specification ? specification : undefined}
            setResult={setResult}
          />
        </Stack.Item>
        {hasResult && result && result.success && (
          <Stack.Item>
            <ValidationSuccess result={result} />
          </Stack.Item>
        )}
        {hasResult && result && !result.success && (
          <Stack.Item>
            <ValidationError result={result} />
          </Stack.Item>
        )}
      </Stack>
      {
        // TODO
        // add reset button to be able to redo with a new file
        // add reset function also to onchange of file
      }
    </section>
  );
};

export default Sheetparser;
