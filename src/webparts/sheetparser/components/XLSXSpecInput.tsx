import * as React from "react";

import { IJsonSpec } from "../../utils/sheetparser";
import { SpecInputColumn } from "./SpecInputColumn";
import { SpecInputSheet } from "./SpecInputSheet";
import { Stack } from "@fluentui/react";

interface IXLSXSpecInputProps {
  setSpecification: React.Dispatch<React.SetStateAction<IJsonSpec | undefined>>;
}

export const XLSXSpecInput: React.FunctionComponent<IXLSXSpecInputProps> = ({
  setSpecification,
}: IXLSXSpecInputProps) => {
  const addSheets = (): void => {
    console.log("Need more sheets");
  };

  const addRow = (rowIndex: number): void => {
    console.log(rowIndex, "Add another row");
  };

  const removeRow = (rowIndex: number): void => {
    console.log(rowIndex, "Remove a row");
  };

  return (
    <>
      <Stack tokens={{ childrenGap: 4 }}>
        <SpecInputSheet addSheets={addSheets} />
        <SpecInputColumn
          setSpecification={setSpecification}
          removeRow={removeRow}
          addRow={addRow}
          rowIndex={1}
          sheetIndex={1}
        />
      </Stack>
    </>
  );
};
