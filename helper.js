/**
 * 전역으로 사용할 javascript
 *
 * @author  WilsonParker
 * @added   2020/08/03
 * @updated 2020/10/15
 */

const helper = {
    /**
     * initialize helper
     *
     * @author  WilsonParker
     * @added   2020/08/13
     * @updated 2020/08/13
     */
    initialize: function () {
        this.cookie.init();
    },

    object: {
        isSet: function (val) {
            return !this.isNonSet(val);
        },
        isNonSet: function (val) {
            return (val === "" || val === '' || val === undefined || val === "undefined" || val == null || typeof val == 'undefined');
        },
        isEmpty: function (val) {
            if (typeof val === 'array') {
                return this.isEmptyArray(val);
            } else if (typeof val === 'string') {
                return this.isEmptyString(val);
            } else if (typeof val === 'object') {
                return this.isEmptyObject(val);
            } else {
                return this.isEmptyObject(val);
            }
        },
        isNonEmpty: function (val) {
            return !this.isEmpty(val);
        },
        isEmptyString: function (val) {
            return this.isSet(val) && (val === "\"\"" || val === "\'\'");
        },
        isNonEmptyString: function (val) {
            return !this.isEmptyString(val);
        },
        isEmptyObject: function (val) {
            return this.isSet(val) && (val === "\"\"" || val === "\'\'");
        },
        isEmptyArray: function (val) {
            return !this.isNonEmptyArray(val);
        },
        isNonEmptyArray: function (val) {
            return Array.isArray(val) && val.length > 0 && this.isSet(val);
        },
        isEmptyMap: function (val) {
            return this.length(val) < 1;
        },
        isNonEmptyMap: function (val) {
            return !this.isEmptyMap(val);
        },
        inArray: function (arr, val) {
            return this.isNonEmptyArray(arr) && arr.includes(val);
        },

        length: function (val) {
            if (this.isNonSet(val))
                return 0;
            if (Array.isArray(val) || val.length !== undefined)
                return val.length;
            else
                return val.keys !== undefined ? val.size : Object.keys(val).length;
        },
        replaceAll: function (str, org, dest) {
            return this.isSet(str) ? str.split(org).join(dest) : "";
        },

        isFunction: function (functionToCheck) {
            return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
        },

        /**
         * collector 를 forEach 하면서 callback 을 실행시킵니다
         *
         * @param   collector
         * @param   callback: function(element, value, idx, resultCallback, carry)
         * 각각의 element, 값, 순서, resultCallback, carry 를 넘겨받습니다
         * @param   resultCallback: callback
         * @param   carry
         * callback 에 결과를 유지하기 위한 값
         * @return  String | returnCallback
         * @author  WilsonParker
         * @added   2019-05-14
         * @updated 2019-05-14
         */
        forEach: function (collector, callback, resultCallback, carry) {
            let keys = Object.keys(collector);
            Object.values = Object.values || this.objectValuesPolyfill;
            let values = Object.values(collector);
            let idx = 0;
            let result = this.isNonSet(carry) ? "" : carry;
            keys.forEach(function (element) {
                let v = values[element] !== undefined ? values[element] : values[idx];
                if (helper.object.isNonSet(resultCallback)) {
                    result += callback(element, v, idx, resultCallback, carry);
                } else {
                    result = carry;
                    callback(element, v, idx, resultCallback, carry);
                }
                idx++;
            });
            return result;
        },
        /**
         * forEach 에서 length 만큼만 반복합니다
         *
         * @param   collector
         * @param   length
         * @param   callback
         * @param   resultCallback
         * @param   carry
         * @return
         * @author  WilsonParker
         * @added   2019-08-27
         * @updated 2019-08-27
         */
        forEachWithLength: function (collector, length = -1, callback, resultCallback, carry) {
            let keys = Object.keys(collector);
            Object.values = Object.values || this.objectValuesPolyfill;
            let values = Object.values(collector);
            let result = this.isNonSet(carry) ? "" : carry;
            let rLength = length === -1 || helper.object.isNonSet(length) ? helper.object.length(collector) : length;
            for (let idx = 0; idx < rLength; idx++) {
                let element = keys[idx];
                let v = values[element] !== undefined ? values[element] : values[idx];
                if (helper.object.isNonSet(resultCallback)) {
                    result += callback(element, v, idx, resultCallback, carry);
                } else {
                    result = carry;
                    callback(element, v, idx, resultCallback, carry);
                }
            }
            return result;
        },
        /**
         * html tag 의 attributes 중 data-obj 의 값을 가져옵니다
         *
         * @param   obj
         * @return  object
         * @author  WilsonParker
         * @added   2019-08-27
         * @updated 2019-08-27
         */
        getDataObj: function (obj) {
            let data = "";
            let dataObj = typeof obj === 'string' ? $(obj) : obj;
            if (dataObj.getAttribute !== undefined) {
                data = dataObj.getAttribute('data-obj');
            } else if (dataObj.attr !== undefined) {
                data = dataObj.attr('data-obj');
            }
            let json = helper.object.replaceAll(data, "\'", "\"");
            return this.isSet(json) ? JSON.parse(json) : "";
        },
        /**
         * html tag 의 attributes 중 data-obj 의 값을 설정 합니다
         *
         * @param   obj
         * @param   key
         * @param   value
         * @return  object
         * @author  WilsonParker
         * @added   2019-08-27
         * @updated 2019-08-27
         */
        setDataObj: function (obj, key, value) {
            let data = this.getDataObj(obj);
            data[key] = value;
            return $(obj).attr('data-obj', JSON.stringify(data))[0];
        },
        /**
         * html tag 의 attributes 중 data-obj 의 값에서 key 를 제거합니다
         *
         * @param   obj
         * @param   key
         * @param   value
         * @return  object
         * @author  WilsonParker
         * @added   2019-08-27
         * @updated 2019-08-27
         */
        removeDataObj: function (obj, key) {
            let data = helper.object.getDataObj(obj);
            delete data[key];
            return $(obj).attr('data-obj', JSON.stringify(data))[0];
        },

        objectToEntriesPolyfill: function (object) {
            return Object
                .keys(object)
                .map(
                    function (key) {
                        return [key, object[key]];
                    }
                );
        },

        objectValuesPolyfill: function (object) {
            return Object
                .keys(object)
                .map(
                    function (key) {
                        return object[key];
                    }
                );
        }
    },

    logger: {
        props: {
            isDebug: false
        },
        setDebug: function (debug) {
            this.props.isDebug = debug;
        },

        /**
         * props 의 isDebug 가 true 일 때 console.log 에 출력합니다
         *
         * @param   args: varargs
         * log 를 출력할 args
         * @return
         * @author  WilsonParker
         * @added   2019-06-15
         * @updated 2019-06-15
         */
        log: function (args) {
            if (this.props.isDebug) {
                helper.object.forEach(arguments, function (idx, item) {
                    console.log(item);
                });
            }
        },
    },

    functions: {
        isFunction: function (possibleFunction) {
            try {
                return typeof (possibleFunction) === typeof (Function);
            } catch (e) {
                return false;
            }
        }
    },

    cookie: {
        time: {
            day: 0,
            hour: 0,
            minute: 0,
            second: 1000,
        },

        init: function () {
            this.time.minute = 60 * this.time.second;
            this.time.hour = 60 * this.time.minute;
            this.time.day = 24 * this.time.hour;
        },

        /**
         * get cookie value
         * @param   name
         * name of cookie
         * @return
         * @author  WilsonParker
         * @added   2020/08/13
         * @updated 2020/08/13
         */
        getCookie: function (name) {
            let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
            return value ? value[2] : 0;
        },

        /**
         * set cookie
         *
         * @param name
         * @param value
         * @param day
         * @param hour
         * @param minute
         * @param second
         * @return
         * @author  WilsonParker
         * @added   2020/08/13
         * @updated 2020/08/13
         */
        setCookie: function (name, value, day = 1, hour = 0, minute = 0, second = 0) {
            let date = new Date();
            let time = (day * this.time.day) + (hour * this.time.hour) + (minute * this.time.minute) + (second * this.time.second);
            date.setTime(date.getTime() + time);
            document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
        },
    },

    html: {
        /**
         * build query string using params
         *
         * @param params
         * @return
         * @author  WilsonParker
         * @added   2020/08/13
         * @updated 2020/08/13
         */
        buildQueryString: function (params) {
            return Object.keys(params).map(key => key + '=' + params[key]).join('&');
        },

        getUrlParams: function () {
            let params = {};
            window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
                params[key] = value;
            });
            return params;
        },
        getQueryString: function () {
            return this.buildQueryString(this.getUrlParams());
        },

        /**
         * add key and value in query string
         * @param key
         * @param value
         * @return
         * @author  WilsonParker
         * @added   2020/08/13
         * @updated 2020/08/13
         */
        addQueryString: function (key, value) {
            let params = this.getUrlParams();
            params[key] = value;
            return this.buildQueryString(params);
        },
    },

    time: {
        loadAfterTime: function (callback, time) {
            setTimeout(callback, time);
        }
    }
};

export {helper}
