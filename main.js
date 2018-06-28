import velement from './velement.js'
import diff from './diff.js'
import patch from './patch.js'



/**
 * 下面的vdom可表示以下的DOM结构
 <div id="container">
   <h1 style="color: red;">simple virtual dom</h1>
   <p>hello world</p>
   <ul>
     <li key="1">item #1</li>
     <li key="2">item #2</li>
   </ul>
   <ul>
     <li key="1">item ##1</li>
     <li key="2">item ##2</li>
   </ul>
 </div>
 */
var vdom = velement('div', { 'id': 'container' }, [
  velement('h1', { style: 'color:red'}, ['simple virtual dom']),
  velement('p', ['hello world']),
  velement('ul', [
    velement('li',{key: 1}, ['item #1']),
    velement('li', {key: 2}, ['item #2'])
  ]),
  velement('ul', [
    velement('li', {key: 1}, ['item ##1']),
    velement('li' ,{key: 2}, ['item ##2'])
  ])
]);

console.log(vdom)
console.log(JSON.stringify(vdom))

var rootnode = vdom.render();

console.log(rootnode)

document.body.appendChild(rootnode);

var newVdom = velement('div', { 'id': 'container' }, [
  velement('h5', { style: 'color:blue' }, ['simple virtual dom']),
  velement('p', ['hello world2']),
  velement('ul', [
    velement('li', {key: 1}, ['item #1']),
    velement('li', {key: 2}, ['item #2']),
    velement('li', {key: 3}, ['item #3'])
  ]),
  velement('ul', [
    velement('li',{key: 1}, ['item ##1'])
  ])
]);

console.log(JSON.stringify(newVdom))

var patches = diff(vdom, newVdom);

console.log(JSON.stringify(patches));

patch(rootnode,patches);

/**
 * patch后的html结构展示
 <div id="container">
   <h5 style="color: blue;">simple virtual dom</h5>
   <p>hello world2</p>
   <ul>
     <li key="1">item #1</li>
     <li key="2">item #2</li>
     <li key="3">item #3</li>
   </ul>
   <ul>
    <li key="1">item ##1</li>
   </ul>
 </div>
 */

