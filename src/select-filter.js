(function (window) {
    function SelectFilter(dom, data, options) {
        var _self = this,
            defaults = {
                filterFn: function ()
            };
        if (!isArray(data) && isObject(data)) {
            options = data;
            this.data = options.data;
        } else {
            options = {};
            options.data = this.data = data;
        }
        this.dom = dom;
        this.options = extend(defaults, options);
        this.ul = document.createElement('ul');
        this.domOldValue;

        this.updateList();
        this._bindEvent();
    }

    SelectFilter.prototype._bindEvent = function () {
        var _self = this;
        _self.dom
        bind(_self.dom, 'keyup', function () {
            _self.updateList();
        });
        bind(_self.dom, 'keydown', function () {
            _self.domOldValue = _self.dom.value;
        });
    };


    SelectFilter.prototype.updateList = function () {
        var _self = this,
            key = _self.dom.value,
            data, filterFn = _self.options.filterFn;
        if (key === _self.domOldValue) {
            return;
        }
        console.log(key);
        if (key === '') {
            data = _self.data.slice();
        } else {
            data = [];
            _self.data.forEach(function (e) {

            });
        }
    };
    window.SelectFilter = SelectFilter;

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

    function isObject(o) {
        return Object.prototype.toString.call(o) === '[object Object]';
    }

})(window);