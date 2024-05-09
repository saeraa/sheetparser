import * as React from "react";

import {
  Dropdown,
  DropdownMenuItemType,
  IDropdownOption,
  IDropdownStyles,
} from "@fluentui/react/lib/Dropdown";
import { IStackTokens, Stack } from "@fluentui/react/lib/Stack";

import { CustomSpecifications } from "./CustomSpecifications";
import { IJsonSpec } from "../../utils/sheetparser";

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 300 },
};

const options: IDropdownOption[] = [
  {
    key: "optionsHeader",
    text: "Premade",
    itemType: DropdownMenuItemType.Header,
  },
  { key: "csv", text: ".csv" },
  { key: "xlsx", text: ".xlsx" },
  { key: "divider_1", text: "-", itemType: DropdownMenuItemType.Divider },
  { key: "custom", text: "Enter own specifications" },
];

const stackTokens: IStackTokens = { childrenGap: 20 };

interface ISpecificationOptionsProps {
  setSpecification: React.Dispatch<React.SetStateAction<IJsonSpec | undefined>>;
}

export const SpecificationOptions: React.FunctionComponent<
  ISpecificationOptionsProps
> = ({ setSpecification }: ISpecificationOptionsProps) => {
  const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>();

  const isCustom = selectedItem?.key === "custom";

  const onChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    setSelectedItem(item);

    switch (item.key) {
      case "xlsx":
        setSpecification({
          sheets: [
            {
              name: "TestSheet",
              columns: [
                { name: "Konto", type: "number" },
                { name: "Datum", type: "/\\d{1,2}\\/\\d{1,2}\\/\\d{2,4}/" },
                { name: "Titel", type: "string" },
              ],
            },
            {
              name: "Sheet2",
              columns: [
                { name: "Kontrakt", type: "string" },
                { name: "ResourceGroup", type: "string" },
              ],
            },
          ],
        });
        break;
      case "csv":
        setSpecification({
          sheets: [
            {
              name: "TestSheet",
              columns: [
                { name: "Konto", type: "number" },
                { name: "Datum", type: "/\\d{1,2}-\\d{1,2}-\\d{2,4}/" },
                { name: "Titel", type: "string" },
              ],
            },
          ],
        });
        break;
      default:
        setSpecification({
          sheets: [
            {
              columns: [
                { name: "Datum", type: "number" },
                { name: "Konto", type: "number" },
                { name: "Titel", type: "string" },
              ],
            },
          ],
        });
    }
  };

  return (
    <Stack tokens={stackTokens}>
      <Dropdown
        // eslint-disable-next-line react/jsx-no-bind
        onChange={onChange}
        placeholder="Select an option"
        label="Choose specifications for processing file"
        selectedKey={selectedItem ? selectedItem.key : undefined}
        options={options}
        styles={dropdownStyles}
      />

      {
        /* 
              TODO!  
              add input for own specifications
              type xlsx: enter worksheet title
              type csv: ignore title
              2 input field with "name", "type"
              + sign to add more rows
              big button to add new worksheet(xlsx)
              
              
              */

        isCustom && <CustomSpecifications setSpecification={setSpecification} />
      }
    </Stack>
  );
};
