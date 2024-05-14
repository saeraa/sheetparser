import * as React from "react";

import {
  Coachmark,
  DefaultButton,
  DirectionalHint,
  TeachingBubbleContent,
  TextField,
} from "@fluentui/react";

import { IJsonSpec } from "../../utils/sheetparser";
import { Stack } from "@fluentui/react/lib/Stack";
import { useBoolean } from "@fluentui/react-hooks";

interface ICustomSpecificationsProps {
  setSpecification: React.Dispatch<React.SetStateAction<IJsonSpec | undefined>>;
  uploadSpecification: (
    file: File | string | undefined,
    fileName: string | undefined,
    template?: boolean
  ) => Promise<boolean | string>;
}

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

export const CustomSpecifications: React.FunctionComponent<
  ICustomSpecificationsProps
> = ({ setSpecification, uploadSpecification }: ICustomSpecificationsProps) => {
  const [
    isCoachmarkVisible,
    { setFalse: hideCoachmark, setTrue: showCoachmark },
  ] = useBoolean(true);
  const [specificationName, setSpecificationName] = React.useState("");
  const targetInput = React.useRef<HTMLInputElement>(null);
  const [jsonError, setJsonError] = React.useState(false);

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

  async function handleUpload(): Promise<void> {
    uploadSpecification(
      targetInput.current?.value,
      specificationName + ".json",
      true
    ).catch((error) => {
      console.error(error);
    });
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

  const onChangeSpecificationName = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setSpecificationName(newValue || "");
    },
    []
  );

  function copyExampleCode(): void {
    navigator.clipboard.writeText(EXAMPLE_CODE.toString()).catch((error) => {
      console.error(error);
    });
  }

  return (
    <Stack>
      <Stack.Item>
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
      </Stack.Item>
      <Stack.Item>
        <TextField
          label="Specification name"
          onChange={onChangeSpecificationName}
          value={specificationName}
        />
      </Stack.Item>
      <Stack.Item>
        <DefaultButton onClick={handleUpload}>
          Upload specification
        </DefaultButton>
      </Stack.Item>
      {isCoachmarkVisible && (
        <Coachmark
          target={targetInput}
          positioningContainerProps={{
            directionalHint: DirectionalHint.topRightEdge,
          }}
          ariaAlertText="A coachmark has appeared"
          ariaDescribedByText="Press enter or alt + C to open the coachmark notification"
          ariaLabelledByText="Coachmark notification"
          delayBeforeMouseOpen={1000}
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
            onDismiss={hideCoachmark}
            isWide={true}
          >
            <pre>{EXAMPLE_CODE.toString()}</pre>
          </TeachingBubbleContent>
        </Coachmark>
      )}
    </Stack>
  );
};
