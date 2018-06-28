import util from './util.js'

/**
 * 虚拟DOM
 * @param {string} tagName 标签名
 * @param {object} props 属性对象
 * @param {array} children 子DOM列表
 * @return {VElement}
 * @constructor
 */
var VElement = function(tagName, props, children) {
  // 保证只能通过如下方式调用：new VElement
  if (!(this instanceof VElement)) {
    return new VElement(tagName, props, children);
  }

  // 可以通过只传递tagName和children参数
  // 参数prop的可选处理，如果第二个参数传的是数组，证明不需要props
  if (util.isArray(props)) {
    children = props;
    props = {};
  }

  //设置虚拟dom的相关属性
  this.tagName = tagName;
  this.props = props || {};
  this.children = children || [];
  // void 666 表示 undefined
  this.key = props ? props.key : void 666;

  // 后代元素的数量（包括文本节点）
  var count = 0;

  util.each(this.children, function(child, i) {
    if (child instanceof VElement) {
      // 若子元素是VElment对象，则证明有count属性，直接加上即可
      count += child.count;
    } else {
      // 不然，则是文本节点
      children[i] = '' + child;
    }
    // 加上此次遍历的元素
    count++;
  });

  this.count = count;
}

/**
 * 根据虚拟DOM创建真实DOM
 * 具体思路：根据虚拟DOM节点的属性和子节点递归地构建出真实的DOM树
 * @return {Element}
 */
VElement.prototype.render = function() {
  //创建标签
  var el = document.createElement(this.tagName);

  //设置标签的属性
  var props = this.props;
  for (var propName in props) {
    var propValue = props[propName]
    util.setAttr(el, propName, propValue);
  }

  // 依次创建子节点的标签
  util.each(this.children, function(child) {
    // 如果子节点仍然为velement，则递归的创建子节点，否则直接创建文本类型节点
    var childEl =
      (child instanceof VElement) ?
      child.render() :
      document.createTextNode(child)

    // 添加子节点
    el.appendChild(childEl);
  });

  return el;
}

export default VElement