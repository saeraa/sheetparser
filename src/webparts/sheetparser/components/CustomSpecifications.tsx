import * as React from "react";

import {
  ChoiceGroup,
  Coachmark,
  DirectionalHint,
  IChoiceGroupOption,
  TeachingBubbleContent,
  TextField,
  Toggle,
} from "@fluentui/react";

import { IJsonSpec } from "../../utils/sheetparser";
import { Stack } from "@fluentui/react/lib/Stack";
import { XLSXSpecInput } from "./XLSXSpecInput";
import { useBoolean as fluentUseBoolean } from "@fluentui/react-hooks";
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

const EXAMPLE_CODE = `{
  "sheets": [
    {
      "name": "Sheet1",
      "columns": [
        { "name": "Column1", "type": "number" },
        { "name": "Column2", "type": "number" },
        { "name": "Column3", "type": "string" }
      ]
    }
  ]
}`;

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
  const [
    isCoachmarkVisible,
    { setFalse: hideCoachmark, setTrue: showCoachmark },
  ] = fluentUseBoolean(true);
  const targetInput = React.useRef<HTMLInputElement>(null);
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

  function copyExampleCode(): void {
    navigator.clipboard.writeText(EXAMPLE_CODE.toString()).catch((error) => {
      console.error(error);
    });
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
            elementRef={targetInput}
            styles={{ root: { fontFamily: "monospace" } }}
            label="Specification code"
            multiline
            rows={3}
            onChange={codeInputChange}
            errorMessage={jsonError ? "Invalid JSON input" : ""}
            invalid={jsonError}
            onMouseOver={hideCoachmark}
            onMouseLeave={showCoachmark}
          />
          {isCoachmarkVisible && (
            <Coachmark
              target={targetInput}
              positioningContainerProps={{
                directionalHint: DirectionalHint.topRightEdge,
                offsetFromTarget: -2,
              }}
              ariaAlertText="A coachmark has appeared"
              ariaDescribedBy="coachmark-desc1"
              ariaLabelledBy="coachmark-label1"
              ariaDescribedByText="Press enter or alt + C to open the coachmark notification"
              ariaLabelledByText="Coachmark notification"
            >
              <TeachingBubbleContent
                primaryButtonProps={{
                  children: "Copy example code",
                  onClick: copyExampleCode,
                }}
                hasSmallHeadline={true}
                headline="JSON specification structure"
                hasCloseButton
                closeButtonAriaLabel="Close"
                ariaDescribedBy="example-description1"
                ariaLabelledBy="example-label1"
                onDismiss={hideCoachmark}
              >
                <pre>{EXAMPLE_CODE.toString()}</pre>
              </TeachingBubbleContent>
            </Coachmark>
          )}
        </>
      )}
    </Stack>
  );
};
