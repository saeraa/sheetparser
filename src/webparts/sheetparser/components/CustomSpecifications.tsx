import * as React from "react";

import {
  ChoiceGroup,
  IChoiceGroupOption,
  TextField,
  Toggle,
} from "@fluentui/react";

import { IJsonSpec } from "../../utils/sheetparser";
import { Stack } from "@fluentui/react/lib/Stack";
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
  const [hasSheetNames, setHasSheetNames] = React.useState(false);
  const [jsonError, setJsonError] = React.useState(false);
  const { value, toggle } = useBoolean(false);
  function onFileFormatChange(
    event: React.FormEvent<HTMLInputElement>,
    option: IChoiceGroupOption
  ): void {
    if (option.key === "csv") setHasSheetNames(false);
    else setHasSheetNames(true);
  }

  /* 
    TODO
    validera JSON? jämföra med IJSONSpec ?
    
    */

  function codeInputChange(
    event: React.FormEvent<HTMLTextAreaElement>,
    newValue?: string | undefined
  ): void {
    if (newValue) {
      try {
        JSON.parse(newValue.toString());
      } catch (error) {
        setJsonError(true);
      }
    }
  }

  return (
    <Stack>
      <Toggle
        label="Enter custom JSON"
        onText="On"
        offText="Off"
        onChange={toggle}
      />
      {!value && (
        <>
          <ChoiceGroup
            label="Choose file format"
            defaultSelectedKey="xlsx"
            options={options}
            onChange={onFileFormatChange}
          />
          {hasSheetNames && <p>Lets do some sheety names</p>}
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
