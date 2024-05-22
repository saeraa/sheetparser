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
import { Shimmer } from "@fluentui/react";
import { useResultContext } from "../context/ResultContext";
import { useSpecFilesContext } from "../context/FileSpecContext";

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 300 },
};

const stackTokens: IStackTokens = { childrenGap: 20 };

interface ISpecificationOptionsProps {
  setSpecification: React.Dispatch<React.SetStateAction<IJsonSpec | undefined>>;
}

export const SpecificationOptions: React.FunctionComponent<
  ISpecificationOptionsProps
> = ({ setSpecification }: ISpecificationOptionsProps) => {
  const { setResult } = useResultContext();

  const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>();
  const [options, setOptions] = React.useState<IDropdownOption[]>([]);

  const { specFiles, getSpecFile, loading } = useSpecFilesContext();

  function generateOptions(): void {
    const tempArray: IDropdownOption[] = [
      {
        key: "optionsHeader",
        text: "Premade",
        itemType: DropdownMenuItemType.Header,
      },
    ];
    const specFilesOptions = specFiles.map((file) => {
      return { key: file.id, text: file.file };
    });
    specFilesOptions.forEach((option) => {
      tempArray.push(option);
    });
    tempArray.push({
      key: "divider_1",
      text: "-",
      itemType: DropdownMenuItemType.Divider,
    });
    tempArray.push({ key: "custom", text: "Enter own specifications" });

    setOptions(tempArray);
  }

  React.useEffect(() => {
    generateOptions();
  }, [specFiles]);

  const isCustom = selectedItem?.key === "custom";

  function setToNewCustomOption(itemId: string): void {
    const newItem = options.find((option) => option.key === itemId);
    setSelectedItem(newItem);
  }

  const onChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    setSelectedItem(item);

    if (item.key === "custom") {
      setSpecification(undefined);
      return;
    }

    getSpecFile(item.key as string)
      .then((json) => {
        if (!json) {
          setResult({
            success: false,
            errors: ["Specification file is invalid"],
            file: undefined,
          });
          return;
        }
        const data = json as IJsonSpec;
        setSpecification(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Shimmer
      isDataLoaded={!loading}
      ariaLabel="Loading specification options..."
    >
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

        {isCustom && (
          <CustomSpecifications
            setToNewCustomOption={setToNewCustomOption}
            setSpecification={setSpecification}
          />
        )}
      </Stack>
    </Shimmer>
  );
};
