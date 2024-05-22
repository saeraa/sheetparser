import React, { createContext, useContext } from "react";

import { IJsonSpec } from "../../utils/sheetparser";
import { getSP } from "../../utils/pnpjsConfig";
import { isValidJsonSpec } from "../components/CustomSpecifications";
import { useBoolean } from "@fluentui/react-hooks";
import { useSPContext } from "./SPContext";

interface IMyContext {
  getSpecFile: (fileId: string) => Promise<IJsonSpec | boolean | void>;
  specFiles: { file: string; id: string }[];
  init: () => Promise<void>;
  loading: boolean;
}

const initialValue: IMyContext = {
  specFiles: [],
  init: () => Promise.resolve(),
  getSpecFile: (fileId: string) => Promise.resolve(),
  loading: false,
};

const SpecFiles = createContext<IMyContext>(initialValue);

const SpecFilesProvider: React.FC = ({ children }) => {
  const [loading, { setFalse: setNotLoading, setTrue: setLoading }] =
    useBoolean(false);

  const [specFiles, setSpecFiles] = React.useState<
    { file: string; id: string }[]
  >([]);

  React.useEffect((): void => {
    init().catch((e) => console.error(e));
  }, []);

  async function init(): Promise<void> {
    getSpecFiles().catch((e) => console.error(e));
  }

  const spContext = useSPContext();
  const sp = getSP(spContext?.context);

  async function getSpecFile(fileId: string): Promise<IJsonSpec | boolean> {
    try {
      if (sp) {
        setLoading();
        const json = await sp?.web.getFileById(fileId).getJSON();
        const isValidJson = isValidJsonSpec(json);
        if (isValidJson) {
          setNotLoading();
          return json;
        }
      }
    } catch (e) {
      setNotLoading();
      return false;
    }
    setNotLoading();
    return false;
  }

  async function getSpecFiles(): Promise<void> {
    if (sp !== undefined) {
      const response = await sp.web
        .getFolderByServerRelativePath("Delade dokument/templates")
        .files();
      setSpecFiles(
        response.map((file) => {
          return { file: file.Name, id: file.UniqueId };
        })
      );
    }
  }

  return (
    <SpecFiles.Provider value={{ specFiles, init, getSpecFile, loading }}>
      {children}
    </SpecFiles.Provider>
  );
};

function useSpecFilesContext(): IMyContext {
  return useContext(SpecFiles);
}

export { SpecFilesProvider, useSpecFilesContext };
