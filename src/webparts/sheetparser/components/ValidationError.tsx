import * as React from "react";

import { MessageBar, MessageBarType, Stack } from "@fluentui/react";

import { IResponse } from "../../utils/sheetparser";

interface IValidationErrorProps {
  result: IResponse;
}

export const ValidationError: React.FunctionComponent<
  IValidationErrorProps
> = ({ result }: IValidationErrorProps) => {
  const { errors } = result;

  const errorList = errors.map((error) => {
    if (error.startsWith("Worksheet:")) {
      return <dt key={error}>{error}</dt>;
    } else return <dd key={error}>{error}</dd>;
  });
  return (
    <>
      <MessageBar delayedRender={false} messageBarType={MessageBarType.error}>
        There are errors in the spreadsheet.
      </MessageBar>
      <Stack styles={{ root: { paddingTop: 10 } }}>{errorList}</Stack>
    </>
  );
};
