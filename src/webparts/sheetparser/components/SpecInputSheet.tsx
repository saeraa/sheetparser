import * as React from "react";

import { DefaultButton, Stack, TextField } from "@fluentui/react";

interface ISpecInputSheetProps {
  addSheets: () => void;
}

export const SpecInputSheet: React.FunctionComponent<ISpecInputSheetProps> = ({
  addSheets,
}) => {
  return (
    <>
      <Stack tokens={{ childrenGap: 4 }}>
        <Stack horizontal>
          <Stack.Item>
            <TextField label="Sheet name:" />
          </Stack.Item>
          <Stack.Item align="end">
            <DefaultButton onClick={addSheets}>Add more sheets</DefaultButton>
          </Stack.Item>
        </Stack>
      </Stack>
    </>
  );
};
