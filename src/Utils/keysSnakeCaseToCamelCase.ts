import * as humps from "humps";

export function keysSnakeCaseToCamelCase(o: any) {
  const output = humps.camelizeKeys(o);
  return output;
}
