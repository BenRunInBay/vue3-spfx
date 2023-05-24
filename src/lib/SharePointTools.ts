import { spfi } from "@pnp/sp";
import "@pnp/sp/webs";
const sp = spfi();

export function getBaseUrl(): string {
  let pathParts = location.pathname.split("/");
  // remove blanks
  let n: number = 0;
  while (n < pathParts.length) {
    if (pathParts[n] == "") pathParts.splice(n, 1);
    else n++;
  }
  // discard last two parts
  if (pathParts.length > 2) pathParts.splice(pathParts.length - 2, 2);
  return location.protocol + "//" + location.host + "/" + pathParts.join("/");
}
export function configureSharePoint(): void {
  //let url: string = getBaseUrl();
  sp.using(sp.web.toUrl); // just an example, ensuring const sp is used to avoid linting error.
}

export function isProduction(): boolean {
  return location != null && location.href != "" && location.href.indexOf("localhost") == -1;
}
