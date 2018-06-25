/*********************************辅助类util*************************************/
//辅助类 Util
var util = {};

/**
 * 判断类型
 * @param obj
 * @return {void|XML|string}
 */
util.type = function(obj) {
  return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');
}

/**
 * 判断是否为数组
 * @param list
 * @return {boolean}
 */
util.isArray = function(list) {
  return util.type(list) === 'Array';
}

/**
 * 判断是否为字符串
 * @param list
 * @return {boolean}
 */
util.isString = function(list) {
  return util.type(list) == 'String';
}

/**
 * 模仿 forEach
 * @param array
 * @param fn
 */
util.each = function(array, fn) {
  for (var i = 0, len = array.length; i < len; i++) {
    fn(array[i], i);
  }
}

/**
 * 转化为数组
 * @param listLike
 * @return {Array}
 */
util.toArray = function(listLike) {
  if (!listLike) {
    return [];
  }

  var list = [];

  for (var i = 0, len = listLike.length; i < len; i++) {
    list.push(listLike[i]);
  }

  return list;
}

/**
 * 设置属性值
 * @param node 节点
 * @param key 属性名
 * @param value 属性值
 */
util.setAttr = function(node, key, value) {
  switch (key) {
    // 样式
    case 'style':
      node.style.cssText = value;
      break;
    case 'value':
      // 获取标签名
      var tagName = node.tagName || '';

      // 将标签名转化为小写
      tagName = tagName.toLowerCase();

      // 如果标签名为input或者textarea，那么就将value值赋值给节点的value属性
      if (tagName === 'input' || tagName === 'textarea') {
        node.value = value;
      }
      // 否则，使用setAttribute为节点设置属性
      else {
        node.setAttribute(key, value);
      }
      break;
    default:
      // 默认使用setAttribute设置属性
      node.setAttribute(key, value);
      break;
  }
}

export default util
