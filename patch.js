import util from './util.js'
/*********************************patch*************************************/
//用于记录两个虚拟dom之间差异的数据结构

/**
 * 每个节点有四种变动
   修改节点属性, 用PROPS表示
   修改节点文本内容, 用TEXT表示
   替换原有节点, 用REPLACE表示
   调整子节点，包括移动、删除等，用REORDER表示
 */

var REPLACE = 0;
var REORDER = 1;
var PROPS = 2;
var TEXT = 3;

/**
 * 修改函数
 * @param {Object} node - 节点对象
 * @example
    <div id="container">
      <h5 style="color: red;">simple virtual dom</h5>
      <p>hello world</p>
      <ul><li>item #1</li><li>item #2</li><li>item #3</li></ul>
      <ul><li>item #1</li></ul>
    </div>
 * @param {Object} patches - 存储差异的对象
 * @example
   {
     "1":[{"type":0,"node":{"tagName":"h5","props":{"style":"color:red"},"children":["simple virtual dom"],"count":1}}],
     "5":[{"type":1,"moves":[{"index":2,"item":{"tagName":"li","props":{},"children":["item #3"],"count":1},"type":1}]}],
     "10":[{"type":1,"moves":[{"index":1,"type":0}]}]
   }
 */
function patch(node, patches) {
  var walker = {
    index: 0
  };

  dfsWalk(node, walker, patches);
}

patch.REPLACE = REPLACE;
patch.REORDER = REORDER;
patch.PROPS = PROPS;
patch.TEXT = TEXT;

/**
 * 深度优先遍历dom结构
 * @param {Object} node - 节点对象
 * @param {Object} walker - 记录
 * @param {Object} patches - 存储差异的对象
 */
function dfsWalk(node, walker, patches) {
  // 当前需要修改的地方
  var currentPatches = patches[walker.index]
  // 当前节点的子节点的长度
  var len = node.childNodes ?
    node.childNodes.length : 
    0;

  // 遍历子节点 - 主要目的是递增index，
  // 这个index其实是对应patches对象中的index值
  // 其实这里就是构建了这样一棵树
  /*
                              div -0
    h1 -1                       p - 3              ul - 5          ...
    simple virtual dom -2    hello world -4        li - 6          ...
                                                   item #1 - 7     ...
                                                   li - 8          ...
                                                   item #2 - 9     ...
   */
  for (var i = 0; i < len; i++) {
    var child = node.childNodes[i];
    walker.index++;

    // 再继续深度遍历
    dfsWalk(child, walker, patches);
  }
  
  // 如果当前节点存在差异
  if (currentPatches) {
    applyPatches(node, currentPatches);
  }
}

/**
 * 将差异应用到真实DOM
 * @param {Object} node - 节点
 * @param {Object} currentPatches - 当前差异对象
 */
function applyPatches(node, currentPatches) {
  util.each(currentPatches, function(currentPatch) {
    switch (currentPatch.type) {
      // 当前修改类为REPLACE
      /*
       REPLACE类的patch形式为：
       patch = {
        type: 0,
        node: <String>|<Object>
       }
       */
      case REPLACE:
        var newNode = null

        if (typeof currentPatch.node === 'String') {
          newNode = document.createTextNode(currentPatch.node)
        } else {
          newNode = currentPatch.node.render()
        }

        node.parentNode.replaceChild(newNode, node);
        break;
      // 当修改类型为REORDER时
      /*
       TEXT类的patch形式为：
       patch = {
        type: 1,
        moves: <Array>
       }
     */
      case REORDER:
        reoderChildren(node, currentPatch.moves);
        break;
      // 当修改类型为PROPS时
      /*
        PROPS类的patch形式为：
        patch = {
         type: 0,
         props: <Object>
        }
      */
      case PROPS:
        setProps(node, currentPatch.props);
        break;
      // 当修改类型为TEXT时
      /*
        TEXT类的patch形式为：
        patch = {
         type: 3,
         content: <String>
        }
      */
      case TEXT:
        // 支持textContent就使用textContent - ie9+
        if (node.textContent) {
          node.textContent = currentPatch.content;
        }
        // 对于文档节点来说, nodeValue返回null.
        // 对于text, comment, 和 CDATA 节点来说, nodeValue返回该节点的文本内容.
        // 对于 attribute 节点来说, 返回该属性的属性值.
        else {
          node.nodeValue = currentPatch.content;
        }
        break;
      default:
        throw new Error('Unknow patch type ' + currentPatch.type);
    }
  });
}

/**
 * 再排序子节点（“再排序”指：新增、删除、移动子节点）
 * @param {Object} node - 节点对象
 * @param {Array} moves - 存储
 */
function reoderChildren(node, moves) {
  // 节点.childNodes是一个类数组
  // 将类数组转化为真正的数组
  var staticNodeList = util.toArray(node.childNodes);
  var maps = {};

  util.each(staticNodeList, function(node) {
    // nodeType为1 - 元素节点
    if (node.nodeType === 1) {
      var key = node.getAttribute('key');
      // key值存在
      if (key) {
        maps[key] = node;
      }
    }
  });

  
  util.each(moves, function(move) {
    var index = move.index;

    // 变动类型为删除节点
    if (move.type === 0) { 
      if (staticNodeList[index] === node.childNodes[index]) {
        node.removeChild(node.childNodes[index]);
      }
      staticNodeList.splice(index, 1);
    } 
    // 添加节点
    else {
      var insertNode = null

      /**
       * 如果type = 1，并且是插入节点，其对象表示为
         move = {
          index: index,
          item: item,
          type: 1
         }
       */

      /**
       * 结构过于复杂，需要转化
       var insertNode = maps[move.item.key]
       ? maps[move.item.key] : (typeof move.item === 'object')
       ? move.item.render() : document.createTextNode(move.item);
       */

      if (maps[move.item.key]) {
        insertNode = maps[move.item.key]
      } else if (typeof move.item === 'object') {
        insertNode = move.item.render()
      } else {
        insertNode = document.createTextNode(move.item)
      }

      staticNodeList.splice(index, 0, insertNode);
      node.insertBefore(insertNode, node.childNodes[index] || null);
    }
  });
}

/**
 * 设置属性
 * @param {Object} node - 节点对象
 * @param {Object} props - 属性对象
 */
function setProps(node, props) {
  for (var key in props) {
    // 如果属性值为undefined，则删除该属性
    // void 666 表示undefined
    if (props[key] === void 666) {
      node.removeAttribute(key);
    }
    // 否则，添加该新属性
    else {
      var value = props[key];
      util.setAttr(node, key, value);
    }
  }
}

export default patch