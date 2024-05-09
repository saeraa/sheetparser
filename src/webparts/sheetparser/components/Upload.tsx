import * as React from "react";

import {
  DefaultPalette,
  FluentTheme,
  FontIcon,
  FontSizes,
  SharedColors,
  Stack,
  Text,
  mergeStyleSets,
  mergeStyles,
} from "@fluentui/react";

interface IUploadProps {
  setFile: (file: File | undefined) => void;
}

const iconClass = mergeStyles({
  fontSize: FontSizes.xLargePlus,
  margin: "0 5px",
});

const iconClassNames = mergeStyleSets({
  displayFile: [{ color: FluentTheme.semanticColors.successIcon }, iconClass],
  isWrongFileFormat: [
    {
      color: FluentTheme.semanticColors.errorIcon,
    },
    iconClass,
  ],
});

const stackClass = mergeStyles({
  cursor: "pointer",
  width: "250px",
  height: "100px",
  padding: 10,
});

const stackClassNames = mergeStyleSets({
  displayFile: [
    {
      background: FluentTheme.semanticColors.successBackground,
      border:
        "dashed 4px " + FluentTheme.semanticColors.successIcon + " !important",
    },
    stackClass,
  ],
  isWrongFileFormat: [
    {
      background: FluentTheme.semanticColors.errorBackground,
      border:
        "dashed 4px " + FluentTheme.semanticColors.errorIcon + " !important",
    },
    stackClass,
  ],
  default: [
    {
      background: DefaultPalette.neutralLight,
      border: "dashed 4px " + SharedColors.gray10 + " !important",
    },
    stackClass,
  ],
});

export const Upload: React.FunctionComponent<IUploadProps> = ({
  setFile,
}: IUploadProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = React.useState({ name: "", extension: "" });

  const calculateFileFormat = function (): boolean {
    if (fileName.name === "" || fileName.extension === "") {
      return false;
    }
    let result = false;
    switch (fileName.extension.toLowerCase()) {
      case "csv":
        result = false;
        break;
      case "xlsx":
        result = false;
        break;
      case "xls":
        result = false;
        break;
      default:
        result = true;
    }
    return result;
  };

  function clickUpload(event: React.MouseEvent): void {
    event.stopPropagation();
    inputRef.current?.click();
  }

  const isWrongFileFormat = React.useMemo(() => {
    const isWrongFormat = calculateFileFormat();
    return isWrongFormat;
  }, [fileName]);

  const displayFile = !isWrongFileFormat && fileName.name !== "";

  function checkFileFormat(file: File): void {
    const name = file.name;
    const lastDot = name.lastIndexOf(".");
    const fileName = name.substring(0, lastDot);
    const extension = name.substring(lastDot + 1);
    setFileName({ name: fileName, extension: extension });

    calculateFileFormat();
  }

  function handleFileInput(event: React.ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    const droppedFiles = event.target.files;
    if (
      droppedFiles &&
      droppedFiles.length > 0 &&
      droppedFiles[0] !== undefined
    ) {
      checkFileFormat(droppedFiles[0]);
      setFile(droppedFiles[0]);
    }
  }

  function handleDrop(event: React.DragEvent<Element>): void {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0 && droppedFiles[0] !== undefined) {
      checkFileFormat(droppedFiles[0]);
      setFile(droppedFiles[0]);
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        style={{ display: "none" }}
        aria-label="upload file for validation"
        type="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        onChange={handleFileInput}
        id="fileInput"
      />
      <Stack onDrop={handleDrop} onDragOver={(event) => event.preventDefault()}>
        <Stack
          horizontalAlign="center"
          verticalAlign="center"
          onClick={clickUpload}
          aria-labelledby="upload-file"
          autoFocus
          className={
            displayFile
              ? stackClassNames.displayFile
              : isWrongFileFormat
              ? stackClassNames.isWrongFileFormat
              : stackClassNames.default
          }
        >
          {displayFile ? (
            <>
              <FontIcon
                aria-hidden={true}
                role="img"
                iconName="ExcelDocument"
                className={iconClassNames.displayFile}
              />
              <Text id="upload-file">
                {fileName.name + "." + fileName.extension}
              </Text>
            </>
          ) : isWrongFileFormat ? (
            <>
              <FontIcon
                aria-hidden={true}
                role="img"
                iconName="FileBug"
                className={iconClassNames.isWrongFileFormat}
              />
              <Text id="upload-file">Unsupported file format</Text>
            </>
          ) : (
            <>
              <FontIcon
                aria-hidden={true}
                role="img"
                iconName="Add"
                className={iconClass}
              />
              <Text id="upload-file">Upload file</Text>
            </>
          )}
        </Stack>
      </Stack>
    </>
  );
};
