import * as React from "react";

import { FontIcon, IStackStyles, Stack, Text } from "@fluentui/react";
import { FontSizes, mergeStyles } from "@fluentui/react/lib/Styling";

import { IResponse } from "../../utils/sheetparser";

interface IValidationSuccessProps {
  result: IResponse;
}

const iconClass = mergeStyles({
  fontSize: FontSizes.large,
  margin: "0 5px",
  color: "green",
});

const stackStyles: IStackStyles = {
  root: {
    padding: 2,
    lineHeight: "2.3",
  },
};

export const ValidationSuccess: React.FunctionComponent<
  IValidationSuccessProps
> = ({ result }: IValidationSuccessProps) => {
  return (
    <div>
      {/* 
                    TODO!  
                    success with checkmark
                    
                    */}
      <Stack horizontal styles={stackStyles}>
        <Stack.Item align="center">
          <FontIcon
            aria-label="Checkmark"
            iconName="Checkmark"
            className={iconClass}
          />
        </Stack.Item>
        <Stack.Item align="center">
          <Text variant="mediumPlus">Successfully validated the file.</Text>
        </Stack.Item>
      </Stack>
    </div>
  );
};
