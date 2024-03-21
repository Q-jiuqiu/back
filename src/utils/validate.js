/*
 * @Author: 何元鹏
 * @Date: 2023-06-06 20:59:09
 * @LastEditors: 何元鹏
 * @LastEditTime: 2024-03-21 17:34:46
 */
/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ["admin", "editor", "aomue002", "aomue001"];
  return valid_map.indexOf(str.trim()) >= 0;
}
