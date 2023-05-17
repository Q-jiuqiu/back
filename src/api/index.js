import request from "@/utils/request";

export function getList(params) {
  return request({
    url: "/pro/rest/dbs/find",
    method: "get",
    params
  });
}
