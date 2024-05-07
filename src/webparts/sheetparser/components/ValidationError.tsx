import * as React from "react";

import { IResponse } from "../../utils/sheetparser";

interface IValidationErrorProps {
  result: IResponse;
}

export const ValidationError: React.FunctionComponent<
  IValidationErrorProps
> = ({ result }: IValidationErrorProps) => {
  const { errors } = result;
  const errorList = errors.map((error) => <li key={error}>{error}</li>);
  return (
    <div>
      {/* 
                    TODO!  
                    datalist for listing errors? or simple li
                    sucess with checkmark or error with x
                    
                    */}
      <p>Nay ☹️</p>
      {errorList}
    </div>
  );
};
