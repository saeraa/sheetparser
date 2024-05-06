import * as React from "react";

import { IIconProps, IStackStyles, Stack } from "@fluentui/react";

import { CommandBarButton } from "@fluentui/react/lib/Button";

export interface IButtonExampleProps {
  // These are set based on the toggles shown above the examples (not needed in real code)
  disabled?: boolean;
  checked?: boolean;
  onClick: () => void;
}

const addIcon: IIconProps = { iconName: "Add" };
const stackStyles: Partial<IStackStyles> = { root: { height: 44 } };

export const UploadButton: React.FunctionComponent<IButtonExampleProps> = (
  props
) => {
  const { disabled, checked, onClick } = props;

  // Here we use a Stack to simulate a command bar.
  // The real CommandBar control also uses CommandBarButtons internally.
  return (
    <Stack horizontal styles={stackStyles}>
      <CommandBarButton
        onClick={onClick}
        iconProps={addIcon}
        text="Upload file"
        // Set split=true to render a SplitButton instead of a regular button with a menu
        // split={true}
        disabled={disabled}
        checked={checked}
      />
    </Stack>
  );
};
