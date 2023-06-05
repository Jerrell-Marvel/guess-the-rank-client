export const addQueryParams = (urlStr: string, field: string, value: string): string => {
  const url = new URL(urlStr);
  // const isParamExist = url.searchParams.get(field);

  // if (isParamExist) {
  //   url.searchParams.set(field, value);
  // } else {
  //   url.searchParams.set("status", "verified");
  // }
  url.searchParams.set(field, value);
  return url.toString();
};
