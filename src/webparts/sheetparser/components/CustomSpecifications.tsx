import * as React from "react";

import {
  Coachmark,
  DefaultButton,
  DefaultEffects,
  DirectionalHint,
  FluentTheme,
  FontIcon,
  FontSizes,
  ITeachingBubbleStyles,
  TeachingBubbleContent,
  TextField,
  mergeStyleSets,
  mergeStyles,
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

const teachingBubbleStyles: Partial<ITeachingBubbleStyles> = {
  body: {
    "& pre": {
      fontSize: FontSizes.small,
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isValidJsonSpec(obj: any): obj is IJsonSpec {
  if (!Array.isArray(obj.sheets)) {
    return false;
  }

  for (const sheet of obj.sheets) {
    if (!Array.isArray(sheet.columns)) {
      return false;
    }

    for (const column of sheet.columns) {
      if (typeof column.name !== "string" || typeof column.type !== "string") {
        return false;
      }
    }
  }

  return true;
}
const EXAMPLE_CODE = `{
  "fileName": "optional regex of filename -
  remove this line to not check the filename",
  "sheets": [
    {
      "name": "optional name of sheet -
      remove this line to not check the sheet name",
      "columns": [
        { "name": "Column1", "type": "number" },
        { "name": "Column2", "type": "regex" },
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
  const [textFieldInput, setTextFieldInput] = React.useState("");
  const [specificationName, setSpecificationName] = React.useState("");
  const targetInput = React.useRef<HTMLInputElement>(null);
  const [jsonError, setJsonError] = React.useState(false);
  const [submitted, setSubmitted] = React.useState({
    submitted: false,
    success: false,
  });

  const disableSubmit = jsonError || !specificationName;

  async function handleUpload(): Promise<void> {
    const result = await uploadSpecification(
      textFieldInput,
      specificationName + ".json",
      true
    );
    setSubmitted({ submitted: true, success: result as boolean });
  }

  function codeInputChange(
    event: React.FormEvent<HTMLTextAreaElement>,
    newValue?: string | undefined
  ): void {
    setTextFieldInput(newValue || "");
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

  const iconClass = mergeStyles({
    fontSize: 25,
    height: 25,
    width: 25,
    margin: "0px 10px",
  });
  const classNames = mergeStyleSets({
    success: [{ color: FluentTheme.semanticColors.successIcon }, iconClass],
    error: [{ color: FluentTheme.semanticColors.errorIcon }, iconClass],
  });

  return (
    <Stack
      styles={{
        root: {
          boxShadow: DefaultEffects.elevation4,
          padding: 15,
          marginBottom: 10,
          border: "1px solid #eaeaea",
        },
      }}
    >
      <Stack.Item>
        <TextField
          elementRef={targetInput}
          styles={{ root: { fontFamily: "monospace" } }}
          label="Specification code"
          multiline
          rows={3}
          value={textFieldInput}
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
        <Stack
          horizontal
          verticalAlign="center"
          styles={{ root: { marginTop: 10 } }}
        >
          <DefaultButton onClick={handleUpload} disabled={disableSubmit}>
            Upload specification
          </DefaultButton>
          {submitted.submitted ? (
            submitted.success ? (
              <FontIcon
                aria-label="Completed"
                iconName="Completed"
                className={classNames.success}
              />
            ) : (
              <FontIcon
                aria-label="Completed"
                iconName="ErrorBadge"
                className={classNames.error}
              />
            )
          ) : null}
        </Stack>
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
            styles={teachingBubbleStyles}
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
