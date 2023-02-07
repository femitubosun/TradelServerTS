import * as humps from "humps";

export function keysSnakeCaseToCamelCase(anObject: any) {
  return humps.camelizeKeys(anObject);
}
