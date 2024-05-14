import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/webs";

import { DefaultButton, Link, Stack } from "@fluentui/react";
import { IJsonSpec, IResponse } from "../../utils/sheetparser";
import { SPFx, spfi } from "@pnp/sp";

import { IFileInfo } from "@pnp/sp/files";
import { ProcessFile } from "./ProcessFile";
import React from "react";
import { SpecificationOptions } from "./SpecificationOptions";
import { Upload } from "./Upload";
import { ValidationError } from "./ValidationError";
import { ValidationSuccess } from "./ValidationSuccess";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import styles from "./Sheetparser.module.scss";

export interface ISheetparserProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  wpContext: WebPartContext;
}

const Sheetparser: React.FC<ISheetparserProps> = ({
  hasTeamsContext,
  wpContext,
}: ISheetparserProps) => {
  const [filePath, setFilePath] = React.useState<string | undefined>();
  const [file, setFile] = React.useState<File | undefined>();
  const [specification, setSpecification] = React.useState<
    IJsonSpec | undefined
  >();

  const sp = spfi().using(SPFx(wpContext));

  const [result, setResult] = React.useState<IResponse | undefined>();

  React.useMemo(() => {
    setResult(undefined);
    setFilePath(undefined);
  }, [specification, file]);

  const hasResult: boolean =
    result !== undefined && result.success !== undefined;

  async function uploadFile(
    file: File | string | undefined,
    fileName: string | undefined,
    template = false
  ): Promise<boolean | string> {
    if (!file || !fileName) return false;

    const filePath = template
      ? "Delade dokument/templates"
      : "Delade dokument/documents";

    setFilePath(undefined);

    let uploadedFile: IFileInfo;

    if (typeof file === "string" || file.size <= 10485760) {
      uploadedFile = await sp.web
        .getFolderByServerRelativePath(filePath)
        .files.addUsingPath(fileName, file, { Overwrite: true });
    } else {
      uploadedFile = await sp.web
        .getFolderByServerRelativePath(filePath)
        .files.addChunked(fileName, file);
    }
    return uploadedFile.LinkingUrl;
  }

  return (
    <section
      className={`${styles.sheetparser} ${hasTeamsContext ? styles.teams : ""}`}
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <Stack.Item>
          <Upload setFile={setFile} />
        </Stack.Item>
        <Stack.Item>
          <SpecificationOptions
            uploadSpecification={uploadFile}
            setSpecification={setSpecification}
          />
        </Stack.Item>
        <Stack.Item>
          <ProcessFile
            file={file ? file : undefined}
            specification={specification ? specification : undefined}
            setResult={setResult}
          />
        </Stack.Item>
        {hasResult && result && result.success && (
          <>
            <Stack.Item>
              <ValidationSuccess result={result} />
            </Stack.Item>
            <Stack.Item>
              <DefaultButton
                onClick={async () => {
                  const uploadedFile = await uploadFile(
                    result.file,
                    result.file?.name
                  );
                  if (typeof uploadedFile === "string") {
                    setFilePath(uploadedFile);
                  } else {
                    setFilePath(undefined);
                  }
                }}
              >
                Upload file
              </DefaultButton>
              {filePath && (
                <Stack.Item>
                  <Link href={filePath}>Uploaded file</Link>
                </Stack.Item>
              )}
            </Stack.Item>
          </>
        )}
        {hasResult && result && !result.success && (
          <Stack.Item>
            <ValidationError result={result} />
          </Stack.Item>
        )}
      </Stack>
    </section>
  );
};

export default Sheetparser;

/* 
 TODO

  add reset button to be able to redo with a new file
  add reset function also to onchange of file

  upload file works - but needs confirmation of upload OK
  get file specs from spec folder

  ability to upload spec to spec folder

 */
