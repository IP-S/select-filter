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

Param: `Object`/`String` ```data``` the Obejct in data Array

Param: `Object`/`String` ```index``` the Obejct in data Array

Param: `Object`/`String` ```dom``` the Obejct in data Array

Desc: 

Return: `String` html string



                chooseCb: function (data, index, dom) {},
                ajaxUrl: '',
                ajaxMethod: 'get',
                setAjaxData: function (value) {
                    return value;
                },
                ajaxSuccess: function () {},
                ajaxError: function () {},
                filterKey: undefined,
                addBtn: false,
                appendInContainer: false