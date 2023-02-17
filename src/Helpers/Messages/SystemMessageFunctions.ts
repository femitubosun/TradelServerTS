export function RESOURCE_FETCHED_SUCCESSFULLY(
  resourceName: string = "Resource"
) {
  return ` ${resourceName} Fetched Successfully`;
}

export function RESOURCE_NOT_FOUND(resourceName: string = "Resource") {
  return `${resourceName} Was not found`;
}
