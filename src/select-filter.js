(function (window) {
    var tpl = {
        li: '<li class="select-filter-item" data-select-filter-data-index="{index}">{content}</li>'
    };

    function SelectFilter(dom, data, options) {
        var _self = this,
            defaults = {
                listBuilder: function (data) {
                    return data;
                },
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
            };
        if (!isArray(data) && isObject(data)) {
            options = data;
            this.data = options.data;
        } else {
            options.data = this.data = data;
        }
        this.dom = dom;
        this.options = extend(defaults, options);
        this.container = document.createElement('div');
        this.ul = document.createElement('ul');
        this.lastLi = document.createElement('li');
        this.domOldValue;
        this.filteredData;

        _updateList.call(this);
        _initLastLi.call(this);
        _bindEvent.call(this);
        _styleHandler.call(this);
        _initDom.call(this);
    }

    window.SelectFilter = SelectFilter;


    //内部函数
    function _updateList() {
        var _self = this,
            data, temp, listBuilder = _self.options.listBuilder,
            html = [];
        data = _filter.call(_self);
        data.forEach(function (e, i) {
            var s = tpl.li
                .replace(/{index}/g, i)
                .replace(/{content}/g, listBuilder.call(_self, e));
            html.push(s);
        });
        _self.ul.innerHTML = html.join('');
        if (_self.options.addBtn) {
            _self.ul.appendChild(_self.lastLi);
        }
    }

    function _filter() {
        var _self = this,
            key = _self.dom.value || '',
            i, l,
            filterKey = _self.options.filterKey,
            data;

        //过滤逻辑
        //从_self.data中根据key筛选数据，并push到data数组中
        if (key === '') {
            data = _self.data.slice();
        } else {
            data = [];
            if (isUndefined(filterKey)) {
                Array.prototype.forEach.call(_self.data, function (e) {
                    console.log(e);
                    if (_self.options.listBuilder(e).indexOf(key) > -1) {
                        data.push(e);
                    }
                });
            } else if (isArray(filterKey)) {
                Array.prototype.forEach.call(_self.data, function (e) {
                    for (i = 0, l = filterKey.length; i < l; i++) {
                        if (e.hasOwnProperty(filterKey[i]) && e[filterKey[i]].indexOf(key) > -1) {
                            data.push(e);
                            break;
                        }
                    }
                });
            } else if (isString(filterKey)) {
                _self.data.forEach(function (e) {
                    if (e.hasOwnProperty(filterKey) && e[filterKey].indexOf(key) > -1) {
                        data.push(e);
                    }
                });
            } else {
                console.error('filterKey must be an Array or a String or undefined')
            }
        }
        //过滤逻辑end
        _self.filteredData = data;
        return data;
    }

    function _initLastLi() {
        var _self = this,
            input, btn, options = _self.options;
        if (!this.options.addBtn) {
            return;
        }
        input = document.createElement('input');
        btn = document.createElement('button');
        btn.innerHTML = '提交';
        bind(btn, 'click', function () {
            btn.disabled = 'disabled';
            var data = options.setAjaxData.call(_self, input.value);
            ajax({
                url: options.ajaxUrl,
                method: options.ajaxMethod,
                data: data,
                success: function (data) {
                    var temp = options.ajaxSuccess(data, input.value);
                    if (!isUndefined(temp)) {
                        _self.data.push(temp);
                        _updateList.call(_self);
                    }
                    btn.disabled = '';
                },
                error: function (d) {
                    options.ajaxError(d);
                }
            });
        });
        _self.lastLi.appendChild(input);
        _self.lastLi.appendChild(btn);
    }

    function _bindEvent() {
        var _self = this;
        bind(_self.dom, 'keyup', function () {
            if (_self.dom.value === _self.domOldValue) {
                return;
            }
            _self.domOldValue = _self.dom.value;
            _updateList.call(_self);
        });
        bind(_self.dom, 'focus', function (e) {
            _self.ul.style.display = 'block';
        });
        bind(document, 'click', function (e) {
            var i, l, el;
            for (i = 0, l = e.path.length; i < l; i++) {
                el = e.path[i];
                if (el === _self.dom || el === _self.ul) {
                    return;
                }
            }
            _self.ul.style.display = 'none';
        });
        bind(_self.ul, 'click', function (e) {
            var li, index, chooseCb = _self.options.chooseCb;
            e.path.forEach(function (el) {
                if (el.parentNode === _self.ul) {
                    li = el;
                }
            });
            if (li.className.indexOf('select-filter-item') > -1) {
                index = li.dataset.selectFilterDataIndex;
                chooseCb.call(_self, _self.filteredData[index], index, _self.dom);
                _self.ul.style.display = 'none';
            }
        });
    }

    function _initDom() {
        this.ul.style.display = 'none';
        if (this.options.appendInContainer) {
            this.dom.parentNode.insertBefore(this.container, this.dom);
            this.container.appendChild(this.dom);
            this.container.appendChild(this.ul);
        } else {
            this.dom.parentNode.appendChild(this.ul);
            this.ul.className = 'select-filter-list';
        }
    }

    function _styleHandler() {
        this.ul.style.width = this.dom.offsetWidth - 2 + 'px';
        this.ul.style.position = 'absolute';
        this.ul.style.top = this.dom.offsetTop + this.dom.offsetHeight - 1 + 'px';
        this.ul.style.left = this.dom.offsetLeft + 'px';
    }

    //通用函数
    var bind = (function () {
        if (window.addEventListener) {
            return function (el, event, fn) {
                el.addEventListener(event, fn);
            }
        } else {
            return function (el, event, fn) {
                el.attachEvent('on' + event, fn);
            }
        }
    })();

    function ajax(options) {
        var xhr = new XMLHttpRequest(),
            defaults = {
                method: 'get',
                url: '',
                data: null,
                contentType: 'application/x-www-form-urlencoded',
                success: function () {},
                error: function () {}
            };
        extend(defaults, options);
        if (xhr) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        options.success.call(xhr, xhr.responseText)
                    } else {
                        options.error.call(xhr, xhr.responseText)
                    }
                }
            }
            if (defaults.method.toLowerCase() === 'get') {
                xhr.open('get', defaults.url + '?' + serialize(defaults.data), true);
                xhr.send(null);
            } else {
                xhr.open('post', defaults.url, true);
                xhr.send(serialize(defaults.data));
            }
        }
    }

    function serialize(param) {
        var suffix = '',
            key;
        if (isObject(param)) {
            for (key in param) {
                if (suffix === '') {
                    suffix += encodeURIComponent(key) + '=' + encodeURIComponent(param[key]);
                } else {
                    suffix += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(param[key]);
                }
            }
            return suffix;
        } else if (isString(param)) {
            return param;
        }

    }

    function extend(target, src) {
        var x;
        for (x in src) {
            target[x] = src[x];
        }
        return target;
    }

    function isArray(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    }

    function isString(o) {
        return Object.prototype.toString.call(o) === '[object String]';
    }

    function isObject(o) {
        return Object.prototype.toString.call(o) === '[object Object]';
    }

    function isUndefined(o) {
        return Object.prototype.toString.call(o) === '[object Undefined]';
    }

})(window);