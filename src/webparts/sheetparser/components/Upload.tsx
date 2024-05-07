import * as React from "react";

import { UploadButton } from "./UploadButton";

interface IUploadProps {
  setFile: (file: File | undefined) => void;
}

export const Upload: React.FunctionComponent<IUploadProps> = ({
  setFile,
}: IUploadProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  function clickUpload(): void {
    inputRef.current?.click();
  }

  const handleDrop = (event: React.DragEvent): void => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setFile(droppedFiles[0]);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        style={{ display: "none" }}
        aria-label="upload file for validation"
        type="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        onChange={handleFileChange}
        id="fileInput"
      />
      <label htmlFor="fileInput">
        <UploadButton onClick={clickUpload} onDrop={handleDrop} />
      </label>
    </>
  );
};
