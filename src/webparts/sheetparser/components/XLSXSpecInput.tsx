import * as React from "react";

import {
  ComboBox,
  DefaultButton,
  IComboBox,
  IComboBoxOption,
  IComboBoxStyles,
  IconButton,
  Stack,
  TextField,
} from "@fluentui/react";

import { IJsonSpec } from "../../utils/sheetparser";

interface ICustomSpecificationsProps {
  setSpecification: React.Dispatch<React.SetStateAction<IJsonSpec | undefined>>;
}

const INITIAL_OPTIONS: IComboBoxOption[] = [
  { key: "number", text: "Number" },
  { key: "string", text: "String" },
];

const comboBoxStyles: Partial<IComboBoxStyles> = { root: { maxWidth: 300 } };
let newKey = 1;
export const XLSXSpecInput: React.FunctionComponent<
  ICustomSpecificationsProps
> = ({ setSpecification }: ICustomSpecificationsProps) => {
  const [selectedKey, setSelectedKey] = React.useState<
    string | number | undefined
  >("number");
  const [options, setOptions] = React.useState(INITIAL_OPTIONS);
  const onComboBoxChange = (
    event: React.FormEvent<IComboBox>,
    option?: IComboBoxOption,
    index?: number,
    value?: string
  ): void => {
    let key = option?.key;
    if (!option && value) {
      key = `${newKey++}`;
      setOptions((prevOptions) => [...prevOptions, { key: key!, text: value }]);
    }
    setSelectedKey(key);
  };
  return (
    <>
      <Stack tokens={{ childrenGap: 4 }}>
        <TextField label="Sheet name:" />
        <Stack horizontal horizontalAlign="center" tokens={{ childrenGap: 4 }}>
          <Stack.Item>
            <TextField label="Column name:" />
          </Stack.Item>
          <Stack.Item>
            <ComboBox
              selectedKey={selectedKey}
              onChange={onComboBoxChange}
              label="Column type:"
              allowFreeform={true}
              autoComplete={"on"}
              options={options}
              styles={comboBoxStyles}
              key={"columnTypes"}
            />
          </Stack.Item>
          <Stack.Item align="end">
            <IconButton
              iconProps={{ iconName: "AddTo" }}
              title="Add more columns"
              ariaLabel="Add more columns"
            />
          </Stack.Item>

          <Stack.Item align="end">
            <IconButton
              iconProps={{ iconName: "RemoveFrom" }}
              title="Remove column"
              ariaLabel="Remove column"
              disabled={true}
            />
          </Stack.Item>
        </Stack>
        <DefaultButton>Add more sheets</DefaultButton>
      </Stack>
    </>
  );
};
