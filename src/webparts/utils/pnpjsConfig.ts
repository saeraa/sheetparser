import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching";

import { SPFI, SPFx, spfi } from "@pnp/sp";

import { WebPartContext } from "@microsoft/sp-webpart-base";

// eslint-disable-next-line no-var
var _sp: SPFI | undefined;

export const getSP = (context?: WebPartContext): SPFI | undefined => {
  if (!!context) {
    // eslint-disable-line eqeqeq
    //You must add the @pnp/logging package to include the PnPLogging behavior it is no longer a peer dependency
    // The LogLevel set's at what level a message will be written to the console
    _sp = spfi().using(SPFx(context));
  }
  return _sp;
};
