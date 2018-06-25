import velement from './velement.js'
import diff from './diff.js'
import patch from './patch.js'

// 旧虚拟DOM
const oldVirtualDOM = velement('div', { 'id': 'container' }, [
  velement('h1', { style: 'color:red' }, ['simple virtual dom']),
  velement('p', ['hello world']),
  velement('ul', [velement('li', ['item #1']), velement('li', ['item #2'])]),
]);

// 旧虚拟DOM的结构
const oldVirtualDOMStru= {
  "tagName":"div",
  "props":{
    "id":"container"
  },
  "children":[
    {
      "tagName":"h1",
      "props":{
        "style":"color:red"
      },
      "children":["simple virtual dom"],
      "count":1
    },
    {
      "tagName":"p",
      "props":{},
      "children":["hello world"],
      "count":1
    },
    {
      "tagName":"ul",
      "props":{},
      "children":[
        {
          "tagName":"li",
          "props":{},
          "children":["item #1"],
          "count":1
        },
        {
          "tagName":"li",
          "props":{},
          "children":["item #2"],
          "count":1
        }
      ],
      "count":4}
  ],
  "count":9
}

// 新虚拟DOM
const newVirtualDOM = velement('div', { 'id': 'container' }, [
  velement('h5', { style: 'color:red' }, ['simple virtual dom']),
  velement('p', ['hello world']),
  velement('ul', [velement('li', ['item #1']), velement('li', ['item #2']), velement('li', ['item #3'])]),
]);

// 新虚拟DOM结构
const newVirtualDOMStru = {
  "tagName": "div",
  "props": {
    "id": "container"
  },
  "children": [
    {
      "tagName": "h5",
      "props": {
        "style": "color:red"
      },
      "children": [
        "simple virtual dom"
      ],
      "count": 1
    },
    {
      "tagName": "p",
      "props": { },
      "children": [
        "hello world"
      ],
      "count": 1
    },
    {
      "tagName": "ul",
      "props": { },
      "children": [
        {
          "tagName": "li",
          "props": { },
          "children": [
            "item #1"
          ],
          "count": 1
        },
        {
          "tagName": "li",
          "props": { },
          "children": [
            "item #2"
          ],
          "count": 1
        },
        {
          "tagName": "li",
          "props": { },
          "children": [
            "item #3"
          ],
          "count": 1
        }
      ],
      "count": 6
    }
  ],
  "count": 11
}


// 找出两个虚拟DOM的不同
const patches = diff(oldVirtualDOM, newVirtualDOM);

// 结果展示
const patchesResult = {
  "1": [
    {
      "type": 0,
      "node": {
        "tagName": "h5",
        "props": {
          "style": "color:red"
        },
        "children": [
          "simple virtual dom"
        ],
        "count": 1
      }
    }
  ],
  "5": [
    {
      "type": 1,
      "moves": [
        {
          "index": 2,
          "item": {
            "tagName": "li",
            "props": { },
            "children": [
              "item #3"
            ],
            "count": 1
          },
          "type": 1
        }
      ]
    }
  ]
}

