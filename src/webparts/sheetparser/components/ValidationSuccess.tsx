import * as React from "react";

import { IResponse } from "../../utils/sheetparser";

interface IValidationSuccessProps {
  result: IResponse;
}

export const ValidationSuccess: React.FunctionComponent<
  IValidationSuccessProps
> = ({ result }: IValidationSuccessProps) => {
  return (
    <div>
      {/* 
                    TODO!  
                    success with checkmark
                    
                    */}
      <p>Yay!</p>
    </div>
  );
};
