import * as React from "react";

import {
  ChoiceGroup,
  IChoiceGroupOption,
  TextField,
  Toggle,
} from "@fluentui/react";

import { IJsonSpec } from "../../utils/sheetparser";
import { Stack } from "@fluentui/react/lib/Stack";
import { XLSXSpecInput } from "./XLSXSpecInput";
import { useBoolean } from "../../utils/useBoolean";

interface ICustomSpecificationsProps {
  setSpecification: React.Dispatch<React.SetStateAction<IJsonSpec | undefined>>;
}
/* 
              TODO!  
              add input for own specifications
              type xlsx: enter worksheet title
              type csv: ignore title
              2 input field with "name", "type"
              + sign to add more rows
              big button to add new worksheet(xlsx)
              
              
              */

const options: IChoiceGroupOption[] = [
  {
    key: "csv",
    text: "CSV",
    iconProps: { iconName: "KnowledgeArticle" },
  },
  {
    key: "xlsx",
    text: "XLSX",
    iconProps: { iconName: "ExcelDocument" },
  },
];

export const CustomSpecifications: React.FunctionComponent<
  ICustomSpecificationsProps
> = ({ setSpecification }: ICustomSpecificationsProps) => {
  const [hasSheetNames, setHasSheetNames] = React.useState(true);
  const [jsonError, setJsonError] = React.useState(false);
  const { value, toggle } = useBoolean(false);
  function onFileFormatChange(
    event: React.FormEvent<HTMLInputElement>,
    option: IChoiceGroupOption
  ): void {
    if (option.key === "csv") setHasSheetNames(false);
    else setHasSheetNames(true);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function isValidJsonSpec(obj: any): obj is IJsonSpec {
    if (!Array.isArray(obj.sheets)) {
      return false;
    }

    for (const sheet of obj.sheets) {
      if (!Array.isArray(sheet.columns)) {
        return false;
      }

      for (const column of sheet.columns) {
        if (
          typeof column.name !== "string" ||
          typeof column.type !== "string"
        ) {
          return false;
        }
      }
    }

    return true;
  }

  function codeInputChange(
    event: React.FormEvent<HTMLTextAreaElement>,
    newValue?: string | undefined
  ): void {
    if (newValue) {
      setSpecification(undefined);
      try {
        const parsedInput = JSON.parse(newValue);
        if (isValidJsonSpec(parsedInput)) {
          setJsonError(false);
          setSpecification(parsedInput);
        } else {
          setJsonError(true);
        }
      } catch (error) {
        setJsonError(true);
      }
    }
  }

  function toggleChange(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    checked?: boolean | undefined
  ): void {
    setSpecification(undefined);
    toggle();
  }

  return (
    <Stack>
      <Toggle
        label="Enter custom JSON"
        onText="On"
        offText="Off"
        onChange={toggleChange}
      />
      {!value && (
        <>
          <ChoiceGroup
            label="Choose file format"
            defaultSelectedKey="xlsx"
            options={options}
            onChange={onFileFormatChange}
          />
          {hasSheetNames && (
            <XLSXSpecInput setSpecification={setSpecification} />
          )}
        </>
      )}
      {value && (
        <>
          <TextField
            styles={{ root: { fontFamily: "monospace" } }}
            label="Specification code"
            multiline
            rows={3}
            onChange={codeInputChange}
            errorMessage={jsonError ? "Invalid JSON input" : ""}
          />
        </>
      )}
    </Stack>
  );
};
