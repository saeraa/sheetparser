import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/webs";

import { DefaultButton, Link, Shimmer, Stack } from "@fluentui/react";
import { IJsonSpec, IResponse } from "../../utils/sheetparser";

import { IFileInfo } from "@pnp/sp/files";
import { ProcessFile } from "./ProcessFile";
import React from "react";
import { SPFI } from "@pnp/sp";
import { SpecificationOptions } from "./SpecificationOptions";
import { Upload } from "./Upload";
import { ValidationError } from "./ValidationError";
import { ValidationSuccess } from "./ValidationSuccess";
import { isValidJsonSpec } from "./CustomSpecifications";
import styles from "./Sheetparser.module.scss";
import { useBoolean } from "@fluentui/react-hooks";

export interface ISheetparserProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  sp: SPFI | undefined;
}

const Sheetparser: React.FC<ISheetparserProps> = ({
  hasTeamsContext,
  sp,
}: ISheetparserProps) => {
  const [result, setResult] = React.useState<IResponse | undefined>();
  const [filePath, setFilePath] = React.useState<string | undefined>();
  const [file, setFile] = React.useState<File | undefined>();
  const [specification, setSpecification] = React.useState<
    IJsonSpec | undefined
  >();
  const [loading, { setFalse: setNotLoading, setTrue: setLoading }] =
    useBoolean(false);
  const [specFiles, setSpecFiles] = React.useState<
    { file: string; id: string }[]
  >([]);

  React.useEffect(() => {
    setLoading();
    getSpecFiles().catch((e) => console.error(e));
  }, []);

  async function getSpecFile(fileId: string): Promise<IJsonSpec | undefined> {
    try {
      const json = await sp?.web.getFileById(fileId).getJSON();
      const isValidJson = isValidJsonSpec(json);
      if (isValidJson) return json;
    } catch (e) {
      setResult({
        success: false,
        errors: ["Specification file is invalid"],
        file: undefined,
      });
      console.log(e);
    }
  }

  async function getSpecFiles(): Promise<void> {
    if (sp !== undefined) {
      const response = await sp.web
        .getFolderByServerRelativePath("Delade dokument/templates")
        .files();
      setSpecFiles(
        response.map((file) => {
          return { file: file.Name, id: file.UniqueId };
        })
      );
      setNotLoading();
    }
  }

  React.useMemo(() => {
    setResult(undefined);
    setFilePath(undefined);
  }, [specification, file]);

  const hasResult: boolean =
    result !== undefined && result.success !== undefined;

  async function uploadFile(
    file: File | string | undefined,
    fileName: string | undefined,
    template: boolean = false
  ): Promise<boolean | string> {
    console.log("uploading file... ");
    if (!file || !fileName) return false;
    if (!sp) return false;

    const filePath = template
      ? "Delade dokument/templates"
      : "Delade dokument/documents";

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
          <Shimmer
            isDataLoaded={!loading}
            ariaLabel="Loading specification options..."
          >
            <SpecificationOptions
              specFiles={specFiles}
              getSpecFile={getSpecFile}
              uploadSpecification={uploadFile}
              setSpecification={setSpecification}
            />
          </Shimmer>
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
