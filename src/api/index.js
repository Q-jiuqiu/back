/*
 * @Author: quling
 * @Date: 2023-05-17 22:08:06
 * @LastEditors: quling
 * @LastEditTime: 2023-05-18 22:30:36
 * @Description:
 * @FilePath: \vue-admin-template\src\api\index.js
 */
import request from "@/utils/request";

// 获取门店数据列表
export function getList(params) {
  return request({
    url: "/pro/rest/dbs/find",
    method: "get",
    params
  });
}

// 新增门店信息
export function addShop(params) {
  return request({
    url: "/pro/rest/dbs/add",
    method: "post",
    data: params
  });
}

// 删除门店信息
export function delShop(id) {
  return request({
    url: `/pro/rest/dbs/delete/${id}`,
    method: "delete"
  });
}

// 修改门店信息
export function editShop(params) {
  return request({
    url: `/pro/rest/dbs/edit`,
    method: "post",
    data: params
  });
}

