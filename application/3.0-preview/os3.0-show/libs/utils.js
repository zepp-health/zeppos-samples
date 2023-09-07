import { getDeviceInfo } from "@zos/device";

export const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = getDeviceInfo();

export function parseQuery(queryString) {
  if (!queryString) {
    return {};
  }
  const query = {};
  const pairs = (
    queryString[0] === "?" ? queryString.substr(1) : queryString
  ).split("&");
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split("=");
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
  }
  return query;
}
