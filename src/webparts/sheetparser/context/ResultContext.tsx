import * as React from "react";

import { createContext, useContext } from "react";

import { IResponse } from "../../utils/sheetparser";

const initialValue: IResultContext = {
  result: undefined,
  setResult: () => {},
};

const ResultContext = createContext<IResultContext>(initialValue);

interface IResultContext {
  result: IResponse | undefined;
  setResult: (result: IResponse | undefined) => void;
}

interface ResultContextProviderProps {
  children?: React.ReactNode;
}

const ResultContextProvider: React.FC<ResultContextProviderProps> = ({
  children,
}) => {
  const [result, setResult] = React.useState<IResponse | undefined>();

  return (
    <ResultContext.Provider value={{ result, setResult }}>
      {children}
    </ResultContext.Provider>
  );
};

function useResultContext(): IResultContext {
  return useContext(ResultContext);
}

export { ResultContextProvider, useResultContext };
