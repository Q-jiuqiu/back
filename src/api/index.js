/*
 * @Author: quling
 * @Date: 2023-05-17 22:08:06
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-09-11 18:22:10
 * @Description:
 * @FilePath: \vue-admin-template\src\api\index.js
 */
import request from "@/utils/request";

// 获取门店数据列表
export function getList(params, page) {
  return request({
    url: `/pro/rest/dbs/find/${page.pageIndex}/${page.pageSize}`,
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
// 新增评论
export function postCommentAdd(params) {
  return request({
    url: `/pro/rest/dbs/add/comment`,
    method: "post",
    data: params
  });
}

// 新增避坑数据
export function postEscapeAdd(params) {
  return request({
    url: `/pro/rest/dbs/add/escape/pit`,
    method: "post",
    data: params
  });
}
// 获取避坑数据列表
export function getEscapeList(page) {
  return request({
    url: `/pro/rest/dbs/find/escape/pit/${page.pageIndex}/${page.pageSize}`,
    method: "get"
  });
}
// 删除避坑信息
export function deleteEscapeShop(id) {
  return request({
    url: `/pro/rest/dbs/delete/escape/pit/${id}`,
    method: "delete"
  });
}
// 获取留言数据列表
export function getFindLeaveList(page) {
  return request({
    url: `/pro/rest/dbs/find/leave/word/${page.pageIndex}/${page.pageSize}`,
    method: "get"
  });
}
// 删除留言信息
export function deleteEscapePit(id) {
  return request({
    url: `/pro/rest/dbs/delete/leave/word/${id}`,
    method: "delete"
  });
}
// 获取数据字典数据列表
export function getDictFind(page, params) {
  return request({
    url: `/pro/rest/dbs/find/levelDist/one/${page.pageIndex}/${page.pageSize}`,
    method: "get",
    params
  });
}
// 新增数据字典数据
export function postDictAdd(params) {
  return request({
    url: `/pro/rest/dbs/add/dict`,
    method: "post",
    data: params
  });
}
// 删除数据字典
export function deleteDictPit(id) {
  return request({
    url: `/pro/rest/dbs/delete/dict/${id}`,
    method: "delete"
  });
}
// 编辑数据字典数据
export function postDictEdit(params) {
  return request({
    url: `/pro/rest/dbs/edit/dict`,
    method: "post",
    data: params
  });
}
// 获取二级类型
export function getTypeFind(type) {
  return request({
    url: `/pro/rest/dbs/find/type/v2/${type}`,
    method: "get"
  });
}
// 新增推荐
export function postRecommendAdd(params) {
  return request({
    url: `/pro/rest/dbs/add/recommend`,
    method: "post",
    data: params
  });
}
// 查询推荐描述
export function getRecommendFind(proId) {
  return request({
    url: `/pro/rest/dbs/find/recommend/${proId}`,
    method: "get"
  });
}
// 编辑推荐描述
export function postRecommendEdit(params) {
  return request({
    url: `/pro/rest/dbs/edit/recommend`,
    method: "post",
    data: params
  });
}
// 删除推荐
export function deleteRecommend(id) {
  return request({
    url: `/pro/rest/dbs/delete/recommend/${id}`,
    method: "delete"
  });
}
// 查询推荐描述
export function getTypeCityFind() {
  return request({
    url: `/pro/rest/dbs/find/type/v2`,
    method: "get"
  });
}

// 新增城市管理
export function postCityDict(params) {
  return request({
    url: `/pro/rest/dbs/city/dict/add`,
    method: "post",
    data: params
  });
}
// 查询城市
export function getCityFind(city) {
  return request({
    url: `/pro/rest/dbs/city/dict/find/${city}`,
    method: "get"
  });
}
// 查询城市分页
export function getCityFindPage(id) {
  return request({
    url: `/pro/rest/dbs/city/dict/find/tree/${id}`,
    method: "get"
  });
}
// 删除城市
export function deleteCityDict(id) {
  return request({
    url: `/pro/rest/dbs/city/dict/delete/${id}`,
    method: "delete"
  });
}
// 编辑城市管理
export function postCityEdit(params) {
  return request({
    url: `/pro/rest/dbs/city/dict/edit`,
    method: "post",
    data: params
  });
}
// 获取评价
export function getCommentById({ id, pageIndex, pageSize }) {
  return request({
    url: `/pro/rest/dbs/find/comment/${id}/${pageIndex}/${pageSize}`,
    method: "get"
  });
}
// 删除评价
export function deleteComment(id) {
  return request({
    url: `/pro/rest/dbs/delete/comment/${id}`,
    method: "delete"
  });
}

// 查询探店
export function getRestFindExp(productId) {
  return request({
    url: `/pro/rest/dbs/exp/find/${productId}`,
    method: "get"
  });
}
// 新增探店
export function postRestExpAdd(params) {
  return request({
    url: `/pro/rest/dbs/exp/add`,
    method: "post",
    data: params
  });
}
// 删除评价
export function deleteExp(id) {
  return request({
    url: `/pro/rest/dbs/exp/del/${id}`,
    method: "delete"
  });
}
// 新增票价
export function postDbsFaresAdd(params) {
  return request({
    url: `/pro/rest/dbs/fares/add`,
    method: "post",
    data: params
  });
}
// 查询票价
export function getFaresFindExp(productId) {
  return request({
    url: `/pro/rest/dbs/fares/find/${productId}`,
    method: "get"
  });
}
// 删除评价
export function deleteFares(id) {
  return request({
    url: `/pro/rest/dbs/fares/del/${id}`,
    method: "delete"
  });
}

// 新增主播
export function getExpUserAdd(params) {
  return request({
    url: `/pro/rest/dbs/expUser/add`,
    method: "post",
    data: params
  });
}
// 编辑主播
export function postFaresFinExp(params) {
  return request({
    url: `/pro/rest/dbs/fares/find`,
    method: "post",
    data: params
  });
}
// 删除主播
export function deleteExpUserDel(id) {
  return request({
    url: `/pro/rest/dbs/expUser/del/${id}`,
    method: "delete"
  });
}
// 查询主播
export function getExpUserFind({ pageIndex, pageSize }) {
  return request({
    url: `/pro/rest/dbs/expUser/find/${pageSize}/${pageIndex}`,
    method: "get"
  });
}
