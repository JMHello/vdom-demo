// 旧虚拟DOM的结构
const oldVirtualDOMStru= {
  "tagName": "div",
  "props": {
    "id": "container"
  },
  "children": [{
    "tagName": "h1",
    "props": {
      "style": "color:red"
    },
    "children": ["simple virtual dom"],
    "count": 1
  }, {
    "tagName": "p",
    "props": {},
    "children": ["hello world"],
    "count": 1
  }, {
    "tagName": "ul",
    "props": {},
    "children": [{
      "tagName": "li",
      "props": {
        "key": 1
      },
      "children": ["item #1"],
      "key": 1,
      "count": 1
    }, {
      "tagName": "li",
      "props": {
        "key": 2
      },
      "children": ["item #2"],
      "key": 2,
      "count": 1
    }],
    "count": 4
  }, {
    "tagName": "ul",
    "props": {},
    "children": [{
      "tagName": "li",
      "props": {
        "key": 1
      },
      "children": ["item ##1"],
      "key": 1,
      "count": 1
    }, {
      "tagName": "li",
      "props": {
        "key": 2
      },
      "children": ["item ##2"],
      "key": 2,
      "count": 1
    }],
    "count": 4
  }],
  "count": 14
}

// 新虚拟DOM结构
const newVirtualDOMStru = {
  "tagName": "div",
  "props": {
    "id": "container"
  },
  "children": [{
    "tagName": "h5",
    "props": {
      "style": "color:blue"
    },
    "children": ["simple virtual dom"],
    "count": 1
  }, {
    "tagName": "p",
    "props": {},
    "children": ["hello world2"],
    "count": 1
  }, {
    "tagName": "ul",
    "props": {},
    "children": [{
      "tagName": "li",
      "props": {
        "key": 1
      },
      "children": ["item #1"],
      "key": 1,
      "count": 1
    }, {
      "tagName": "li",
      "props": {
        "key": 2
      },
      "children": ["item #2"],
      "key": 2,
      "count": 1
    }, {
      "tagName": "li",
      "props": {
        "key": 3
      },
      "children": ["item #3"],
      "key": 3,
      "count": 1
    }],
    "count": 6
  }, {
    "tagName": "ul",
    "props": {},
    "children": [{
      "tagName": "li",
      "props": {
        "key": 1
      },
      "children": ["item ##1"],
      "key": 1,
      "count": 1
    }],
    "count": 2
  }],
  "count": 14
}


// 比较结果展示
const patchesResult = {
  "1": [{
    "type": 0,
    "node": {
      "tagName": "h5",
      "props": {
        "style": "color:blue"
      },
      "children": ["simple virtual dom"],
      "count": 1
    }
  }],
  "4": [{
    "type": 3,
    "content": "hello world2"
  }],
  "5": [{
    "type": 1,
    "moves": [{
      "index": 2,
      "item": {
        "tagName": "li",
        "props": {
          "key": 3
        },
        "children": ["item #3"],
        "key": 3,
        "count": 1
      },
      "type": 1
    }]
  }],
  "10": [{
    "type": 1,
    "moves": [{
      "index": 1,
      "type": 0
    }]
  }]
}

