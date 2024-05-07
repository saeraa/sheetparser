import * as React from "react";

import {
  DefaultPalette,
  FontIcon,
  FontSizes,
  Stack,
  Text,
  mergeStyles,
} from "@fluentui/react";

export interface IUploadButtonProps {
  onClick: () => void;
  onDrop: (event: React.DragEvent) => void;
}

const iconClass = mergeStyles({
  fontSize: FontSizes.xLargePlus,
  margin: "0 5px",
  color: "black",
});

const stackStyles = {
  outer: {
    root: {
      width: "250px",
      height: "100px",
      padding: 6,
      background: DefaultPalette.neutralLight,
      border: "none",
    },
  },
  inner: {
    root: {
      cursor: "pointer",
      width: "100%",
      height: "100%",
      padding: 10,
      background: DefaultPalette.neutralLight,
      border: "dashed 2px gray",
    },
  },
};

export const UploadButton: React.FunctionComponent<IUploadButtonProps> = (
  props
) => {
  const { onClick, onDrop } = props;
  const [fileName, setFileName] = React.useState({ name: "", extension: "" });

  const calculateFileFormat = function (): boolean {
    if (fileName.name == "" || fileName.extension == "") {
      return false;
    }
    let result = false;
    switch (fileName.extension) {
      case "csv" || "xlsx" || "xls":
        result = false;
        break;
      default:
        result = true;
    }

    return result;
  };

  const isWrongFileFormat = React.useMemo(() => {
    const isWrongFormat = calculateFileFormat();
    return isWrongFormat;
  }, [fileName]);

  const displayFile = !isWrongFileFormat && fileName.name !== "";

  function checkFileFormat(e: React.DragEvent<Element>): void {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      if (droppedFiles[0] !== undefined) {
        const name = droppedFiles[0].name;
        const lastDot = name.lastIndexOf(".");
        const fileName = name.substring(0, lastDot);
        const extension = name.substring(lastDot + 1);
        setFileName({ name: fileName, extension: extension });
      }
    }

    calculateFileFormat();
  }

  function handleDrop(e: React.DragEvent<Element>): void {
    checkFileFormat(e);
    onDrop(e);
  }

  return (
    <Stack
      styles={stackStyles.outer}
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
    >
      <Stack
        horizontalAlign="center"
        verticalAlign="center"
        styles={stackStyles.inner}
        onClick={onClick}
        aria-labelledby="upload-file"
        autoFocus
      >
        {displayFile ? (
          <>
            <FontIcon
              aria-hidden={true}
              role="img"
              iconName="ExcelDocument"
              className={iconClass}
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
              className={iconClass}
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
  );
};
