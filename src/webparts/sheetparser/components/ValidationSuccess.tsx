import * as React from "react";

import { MessageBar, MessageBarType } from "@fluentui/react";

import { IResponse } from "../../utils/sheetparser";

interface IValidationSuccessProps {
  result: IResponse;
}

export const ValidationSuccess: React.FunctionComponent<
  IValidationSuccessProps
> = ({ result }: IValidationSuccessProps) => {
  return (
    <MessageBar delayedRender={false} messageBarType={MessageBarType.success}>
      File successfully validated.
    </MessageBar>
  );
};
