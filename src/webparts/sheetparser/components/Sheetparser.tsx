import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/webs";

import { DefaultButton, Link, Stack } from "@fluentui/react";

import { IFileInfo } from "@pnp/sp/files";
import { IJsonSpec } from "../../utils/sheetparser";
import { ProcessFile } from "./ProcessFile";
import React from "react";
import { SpecificationOptions } from "./SpecificationOptions";
import { Upload } from "./UploadFile";
import { ValidationError } from "./ValidationError";
import { ValidationSuccess } from "./ValidationSuccess";
import { getSP } from "../../utils/pnpjsConfig";
import styles from "./Sheetparser.module.scss";
import { useResultContext } from "../context/ResultContext";
import { useSPContext } from "../context/SPContext";

export interface ISheetparserProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}

const Sheetparser: React.FC<ISheetparserProps> = ({
  hasTeamsContext,
}: ISheetparserProps) => {
  const spContext = useSPContext();
  const sp = getSP(spContext?.context);
  const { result, setResult } = useResultContext();

  const [filePath, setFilePath] = React.useState<string | undefined>();
  const [file, setFile] = React.useState<File | undefined>();
  const [specification, setSpecification] = React.useState<
    IJsonSpec | undefined
  >();

  React.useMemo(() => {
    setResult(undefined);
    setFilePath(undefined);
  }, [specification, file]);

  const hasResult = React.useMemo(() => {
    return result !== undefined && result.success !== undefined;
  }, [result]);

  async function uploadFile(
    file: File | string | undefined,
    fileName: string | undefined
  ): Promise<boolean | string> {
    if (!file || !fileName) return false;
    if (!sp) return false;

    const filePath = "Delade dokument/documents";

    setFilePath(undefined);

    let uploadedFile: IFileInfo;

    if (typeof file === "string" || file.size <= 10485760) {
      uploadedFile = await sp.web
        .getFolderByServerRelativePath(filePath)
        .files.addUsingPath(fileName, file, { Overwrite: true });
      return uploadedFile.LinkingUrl.length > 0
        ? uploadedFile.LinkingUrl
        : uploadedFile.Name;
    } else {
      uploadedFile = await sp.web
        .getFolderByServerRelativePath(filePath)
        .files.addChunked(fileName, file);
      return uploadedFile.LinkingUrl;
    }
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
          <SpecificationOptions setSpecification={setSpecification} />
        </Stack.Item>
        <Stack.Item>
          <ProcessFile
            file={file ? file : undefined}
            specification={specification ? specification : undefined}
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
