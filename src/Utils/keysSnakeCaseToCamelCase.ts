import * as humps from "humps";

export function keysSnakeCaseToCamelCase(o: any) {
  return humps.camelizeKeys(o);
}
