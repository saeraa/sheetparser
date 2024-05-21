import * as React from "react";

import { createContext, useContext } from "react";

import { WebPartContext } from "@microsoft/sp-webpart-base";

const SPContext = createContext<ISPContext | undefined>(undefined);

interface ISPContext {
  context: WebPartContext;
}

interface SPContextProviderProps {
  children?: React.ReactNode;
  context: WebPartContext;
}

const SPContextProvider: React.FC<SPContextProviderProps> = ({
  children,
  context,
}) => {
  return (
    <SPContext.Provider value={{ context }}>{children}</SPContext.Provider>
  );
};

function useSPContext(): ISPContext | undefined {
  return useContext(SPContext);
}

export { SPContextProvider, useSPContext };
