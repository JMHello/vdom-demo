/**
 * Diff two list in O(N).
 * @param {Array} oldList - Original List  原始列表
 * @param {Array} newList - List After certain insertions, removes, or moves 新的列表
 * @return {Object} - {moves: <Array>, children: <Array>}
 *                   - moves is a list of actions that telling how to remove and insert
 *                   - children
 */
function listDiff (oldList, newList, key) {
  var oldMap = makeKeyIndexAndFree(oldList, key)
  var newMap = makeKeyIndexAndFree(newList, key)
  
  var newFree = newMap.free

  var oldKeyIndex = oldMap.keyIndex
  var newKeyIndex = newMap.keyIndex

  var moves = []

  // childern - a simulate list to manipulate
  var children = []
  var i = 0
  var item
  var itemKey
  var freeIndex = 0

  // fist pass to check item in old list: if it's removed or not
  // 以旧的列表为循环基准，但以新的列表项为push的结果
  // 看看是否在新的虚拟DOM中移除了某些元素，移除了的用null做标记
  while (i < oldList.length) {
    item = oldList[i]
    itemKey = getItemKey(item, key)

    // 针对list和item的情况，即有key属性值
    if (itemKey) {
      // 若删除了其中的某个，比如从 li[key="1"], li[key="2"] 变成了 li[key="1"]
      // 比如一个ul里有多个li，在react中，要求生成li的时候，要为每个li都生成key值
      // 在新子节点存储key值的对象中，如果找不到旧子节点中对应的key值，证明这个节点被删除
      if (!newKeyIndex.hasOwnProperty(itemKey)) {
        children.push(null)
      } 
      // 没被删除的节点，直接push到children数组里即可，不过添加的项是新子节点数组里的项
      else {
        var newItemIndex = newKeyIndex[itemKey]
        children.push(newList[newItemIndex])
      }
    }
    // 没有key属性值的情况
    else {
      var freeItem = newFree[freeIndex++]
      children.push(freeItem || null)
    }

    i++
  }

  // children数组的副本
  var simulateList = children.slice(0)

  // 将标记为null的移除
  i = 0
  while (i < simulateList.length) {
    if (simulateList[i] === null) {
      remove(i)
      removeSimulate(i)
    } else {
      i++
    }
  }

  // i is cursor pointing to a item in new list
  // j is cursor pointing to a item in simulateList
  var j = i = 0

  // 以新的列表为循环基准
  // 将新列表的项和经过删除处理的数组simulateList的项作比较
  // 其实simulateList就是旧的list处理后的结果数组
  while (i < newList.length) {
    item = newList[i]
    itemKey = getItemKey(item, key)

    var simulateItem = simulateList[j]
    var simulateItemKey = getItemKey(simulateItem, key)

    if (simulateItem) {
      if (itemKey === simulateItemKey) {
        j++
      }
      // 有新项
      else {
        // new item, just inesrt it
        // 如果在旧子节点存储的key对象中找不到新项的key值，那么这个新项直接添加
        if (!oldKeyIndex.hasOwnProperty(itemKey)) {
          insert(i, item)
        }
        // 如果找到，则需要做移动
        else {
          // if remove current simulateItem make item in right place
          // then just remove it
          var nextItemKey = getItemKey(simulateList[j + 1], key)
          if (nextItemKey === itemKey) {
            remove(i)
            removeSimulate(j)
            j++ // after removing, current j is right, just jump to next one
          } else {
            // else insert item
            insert(i, item)
          }
        }
      }
    }
    // 当simulateList为undefined的时候，则证明有新的一项加入
    else {
      insert(i, item)
    }

    i++
  }

  function remove (index) {
    var move = {
      index: index, 
      type: 0
    }
    
    moves.push(move)
  }

  function insert (index, item) {
    var move = {
      index: index, 
      item: item, 
      type: 1
    }
    
    moves.push(move)
  }

  function removeSimulate (index) {
    simulateList.splice(index, 1)
  }

  return {
    moves: moves,
    children: children
  }
}

/**
 * Convert list to key-item keyIndex object.
 * @param {Array} list - 列表
 * @param {String|Function} key - key值 
 * @return {Object} - {keyIndex: <Object>}
 *                   - 如: {1: 0, 2: 1, 3: 2}
 *                   - {free: <Array>}
 *                   - 如：[VElement{...}, VElement{...}, 'hello world']
 */
function makeKeyIndexAndFree (list, key) {
  var keyIndex = {}
  var free = []

  for (var i = 0, len = list.length; i < len; i++) {
    var item = list[i]
    // 获取属性key值
    var itemKey = getItemKey(item, key)

    if (itemKey) {
      // key值：在list中的索引
      keyIndex[itemKey] = i
    } else {
      // 直接把子虚拟DOM对象添加到free数组中
      free.push(item)
    }
  }

  return {
    keyIndex: keyIndex,
    free: free
  }
}

/**
 * 获取唯一标识
 * @param {Object} item - 虚拟DOM对象
 * @param {String|Function} key - 标识
 * @return {String|Number|undefined}
 */
function getItemKey (item, key) {

  if (!item || !key) return void 666
  
  return typeof key === 'string'
    ? item[key]
    : key(item)
}

export { makeKeyIndexAndFree, listDiff }

