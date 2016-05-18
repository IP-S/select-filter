# select-filter
下拉选择组件，支持动态添加选项。
# Usage
引入```<script src="select-filter.js"></script>```

```<input id="elementId"/>```

```
var data = [
    '1234',
    'asdf'
];
var a = new SelectFilter(document.getElementById('elementId'), data);

```
# API
### SelectFilter(dom[, data] [, options]);
#### dom
Type: `HTMLInputElement`

not null
#### data
Type: `Array`

not null
#### options
Type: `Object`

##### options.listBuilder
Type: `Function`: ```function(data)```

Param: `Object`/`String` ```data``` the Obejct in data Array

Desc: a function to build html that will be set into the Li element.

Return: `String` html string

##### options.chooseCb
Type: `Function`: ```function (data, index, dom)```

Param: `Object`/`String` ```data``` the data that you choose

Param: `Number` ```index``` the data's index that you choose in the filtered array 

Param: `HTMLInputElement` ```dom``` the input element

Desc: the callback when you choose an item

##### options.ajaxUrl
Type: `String`: default `''`

Desc: the URL that the ajax data will commit to.

##### options.ajaxMethod
Type: `String`: default `'get'`

Desc: ajax method.

##### options.setAjaxData
Type: `Function`: ``` function (value)```

Param: `Object`/`String` ```value``` the value that you input

Desc: a function to build the ajax data.

Return: `Object` ajax data.

##### options.ajaxSuccess
Type: `Function`: ``` function (data, value)```

Param: `Object` ```data``` the ajax response.

Param: `String` ```value``` the value that you input.

Desc: ajax success callback.

Return: `Object` an Object that will be pushed into the data array.

##### options.ajaxError
Type: `Function`: ``` function (data)```

Param: `Object` ```data``` the ajax response.

Desc: ajax error callback.

##### options.filterKey
Type: `String`: default `undefined`

Desc: the filter function will filter the origin data according this key. It can be `undefined` while the origin data is an String array. It can be a String while the origin data is an Object array. It can be an Array of String while filter the data according multiple key.

##### options.addBtn
Type: `Boolean`: default `false`

Desc: `true` to show the add content li, and `false` to hide.

##### options.appendInContainer
Type: `Boolean`: default `false`

Desc: whatever, sugguest to be `ture`

## method
#### SelectFilter.prototype.show()
Desc: show list.

#### SelectFilter.prototype.hide()
Desc: hide list.
