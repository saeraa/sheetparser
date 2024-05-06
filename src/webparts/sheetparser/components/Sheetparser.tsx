import { IJsonSpec, IResponse } from "../../utils/sheetparser";

import { ISheetparserProps } from "./ISheetparserProps";
import { ProcessFile } from "./ProcessFile";
import React from "react";
import { SpecificationOptions } from "./SpecificationOptions";
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
      <div>
        <Upload setFile={setFile} />
        {file && (
          <p>
            File selected is: {file.name} of the type {file.type}
          </p>
        )}
        <SpecificationOptions setSpecification={setSpecification} />
        <ProcessFile
          file={file ? file : undefined}
          specification={specification ? specification : undefined}
          setResult={setResult}
        />
      </div>
      <div>
        {hasResult && result && result.success && (
          <ValidationSuccess result={result} />
        )}
        {hasResult && result && !result.success && (
          <ValidationError result={result} />
        )}
      </div>
      {
        // TODO
        // add reset button to be able to redo with a new file
        // add reset function also to onchange of file
      }
    </section>
  );
};

export default Sheetparser;
