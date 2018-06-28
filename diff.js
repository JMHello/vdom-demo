
import util from './util.js'
import patch from './patch.js'
import { listDiff } from './list-diff.js'

/**
 * 避免了diff算法的复杂性，对同级别节点进行比较的常用方法是深度优先遍历
 * @param {Object} oldTree - 旧DOM树
 * @param {Object} newTree - 新DOM树
 * @return {{}}
 */
function diff(oldTree, newTree) {
  // 节点的遍历顺序
  var index = 0;
  // 在遍历过程中记录节点的差异
  var patches = {};

  // 深度优先遍历两棵树
  dfsWalk(oldTree, newTree, index, patches);

  return patches;
}

/**
 * 深度遍历
 * @param {Object} oldNode 旧节点
 * @param {Object} newNode 新节点
 * @param {number} index 节点遍历的顺序
 * @param {Object} patches 记录差异的对象
 */
function dfsWalk(oldNode, newNode, index, patches) {
  var currentPatch = [];

  // 新节点不存在，删除对应的旧节点
  if (newNode === null) {
    // 依赖listdiff算法进行标记为删除
  }
  // 新旧节点都为文本节点，并且文本内容不一样
  else if (util.isString(oldNode) && util.isString(newNode) && oldNode !== newNode) {
    // 如果是文本节点则直接替换文本
    currentPatch.push({
      type: patch.TEXT,
      content: newNode
    })
  }
  // 元素节点 - 节点类型相同
  // key值为undefined？？？
  else if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
    // 比较节点的属性是否相同
    var propsPatches = diffProps(oldNode, newNode);

    if (propsPatches) {
      currentPatch.push({
        type: patch.PROPS,
        props: propsPatches
      });
    }

    // 如果子节点为文本节点，那么文本节点的子节点肯定是undefined，所以不用做以下操作
    // 因为要修改文本节点的操作已经在dfsWalk函数中实现了
    if (oldNode.children != null && newNode.children != null) {
      // 比较子节点是否相同
      diffChildren(oldNode.children, newNode.children, index, patches, currentPatch);
    }
  }
  // 节点的类型不同，直接替换
  else {
    currentPatch.push({
      type: patch.REPLACE,
      node: newNode
    });
  }

  // 标识哪一个节点有变化
  if (currentPatch.length) {
    patches[index] = currentPatch;
  }
}

/**
 * 比较新旧节点的属性
 * @param {Object} oldNode - 旧节点
 * @param {Object} newNode -  新节点
 * @return {*}
 */
function diffProps(oldNode, newNode) {
  // count其实就是一个标识：用来判断新旧节点的属性是否有不同
  // 如果count仍然为0，证明没有不同
  // 如果count大于0，那么证明有不同
  var count = 0;
  var oldProps = oldNode.props;
  var newProps = newNode.props;
  var key, value;
  var propsPatches = {};

  // 找出不同的属性，以旧节点的属性为基准
  // 如果旧属性对象中的属性在新属性对象中不存在，
  // 这个属性也会被存在propsPatches中，不过其值为undefined
  // undefined 是一个标识，主要用来删除不存在的属性
  for (key in oldProps) {
    value = oldProps[key];

    if (newProps[key] != value) {
      count++;
      propsPatches[key] = newProps[key];
    }
  };

  // 找出新增的属性 - 以新节点的属性为基准
  for (key in newProps) {
    value = newProps[key];

    if (!oldProps.hasOwnProperty(key)) {
      count++;
      propsPatches[key] = newProps[key];
    }
  }

    if (count === 0) {
    return null;
  }
  
  return propsPatches;
}

/**
 * 比较子节点
 * @param {Array} oldChildren - 旧节点的子节点
 * @param {Array} newChildren - 新节点的子节点
 * @param {Number} index - 节点遍历的顺序
 * @param {Object} patches - 记录差异的对象
 * @param {Array} currentPatch - 记录当前新旧节点差异的数组
 */
function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
  var diffs = listDiff(oldChildren, newChildren, 'key');

  // 找到不同的子节点
  newChildren = diffs.children;

  if (diffs.moves.length) {
    // reorder 包括 删除、移动、新增 子节点
    var reorderPatch = {
      type: patch.REORDER,
      moves: diffs.moves
    }

    currentPatch.push(reorderPatch);
  }

  var leftNode = null;
  var currentNodeIndex = index;

  // 基准是旧的子节点
  util.each(oldChildren, function(child, i) {
    var newChild = newChildren[i];
    
    // 计算节点标识
    if (leftNode && leftNode.count) {
      currentNodeIndex = currentNodeIndex + leftNode.count + 1
    } else {
      currentNodeIndex = currentNodeIndex + 1
    }

    // 深度遍历子节点
    dfsWalk(child, newChild, currentNodeIndex, patches);
    
    leftNode = child;
  });
}


export default diff
