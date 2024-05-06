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

  return (
    <div>
      <input
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        onChange={handleFileChange}
      />
      <UploadButton onClick={clickUpload} />
    </div>
  );
};
