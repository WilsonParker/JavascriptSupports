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
        isCallable: function (obj) {
            return obj instanceof Function;
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
         * @updated 2021-01-14
         */
        forEach: function (collector, callback, resultCallback, carry) {
            let idx = 0;
            let result = this.isNonSet(carry) ? "" : carry;

            if (collector instanceof Map) {
                collector.forEach(function (value, key, map) {
                    if (helper.object.isNonSet(resultCallback)) {
                        result += callback(key, value, idx, resultCallback, carry);
                    } else {
                        result = carry;
                        callback(key, value, idx, resultCallback, carry);
                    }
                    idx++;
                });
            } else if (collector instanceof Object || collector instanceof Array) {
                let keys = Object.keys(collector);
                Object.values = Object.values || this.objectValuesPolyfill;
                let values = Object.values(collector);
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
            }

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

    /*
         * =====================================================================================================================
         * VALIDATE
         *
         *
         *
         * START
         * =====================================================================================================================
         */
    validation: {
        // 입력을 허용할 regex 입니다
        allowReg: {
            // 숫자
            number: /[^0-9]/g
            // 한글
            , kor: /[^가-힣]/g
            , eng: /[^a-z]/gi
            // 특수문자
            , char: /[^`~!@#$%^&*|\\\'\";:\/?]/gi
            , numberAndKor: /[^0-9가-힣]/g
            , numberAndEng: /[^0-9a-zA-Z]/g
            , numberAndKorAndEng: /[^0-9가-힣a-zA-Z]/g
            , numberAndKorAndEngAndChar: /[^0-9가-힣a-zA-Z^`~!@#$%^&*|\\\'\";:\/?]/g
            , numberAndEngAndChar: /[^0-9a-zA-Z^`~!@#$%^&*|\\\'\";:\/?]/g
        },
        reg: {
            number: /[0-9]/g
            // , numberAndEng: /[0-9a-z]/g
            , kor: /[가-힣]/g
            , eng: /[a-z]/gi
            , char: /[`~!@#$%^&*|\\\'\";:\/?]/gi
            , email: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
            , phone: /^\d{2,3}-\d{3,4}-\d{4}$/
            , id: /[a-z0-9_]{4,16}/gi
            , password: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/
            , url: /^(file|gopher|news|nntp|telnet|https?|ftps?|sftp):\/\/([a-z0-9-]+\.)+[a-z0-9]{2,4}.*$/
            // , htmlTag : /\\<(/?[^\\>]+)\\>/
            , image: /([^\s]+(?=\.(jpg|gif|png))\.\2)/
        },
        validatorType: {
            validator: "validator",
            fileValidator: "fileValidator",
            editorValidator: "editorValidator",
            dateValidator: "dateValidator"
        },

        /**
         * selector 에 올바른 값만 입력되도록 설정합니다
         *
         * @param   selector
         * @param   allowReg
         * validate.allowReg
         * @author   WilsonParker
         * @added   2019-06-15
         * @updated 2019-06-15
         */
        allowInput: function (selector, allowReg) {
            $(selector).on("input", function () {
                let v = $(this).val();
                $(this).val(this.replace(v, allowReg));
            });
        },

        replace: function (value, reg, replace = '') {
            return value.replace(reg, replace);
        },

        /**
         * selector 의 입력 length 가 limit 을 넘지 않도록 합니다
         *
         * @param   selector
         * @param   limit
         * @return
         * @author   WilsonParker
         * @added   2019-06-15
         * @updated 2019-06-15
         */
        limitInput: function (selector, limit) {
            $(selector).on("input", function () {
                let v = $(this).val();
                if (v.length > limit)
                    $(this).val(v.substr(0, limit));
            });
        },

        match: function (val, reg) {
            return val.match(reg)
        },

        /**
         * Password Validation check 를 하는 기본적인 Function 입니다
         *
         * @param   passwordSelector
         * @param   passwordCheckSelector
         * @param   warningCallback: function(selector, message)
         * validation 이 올바르지 않을 때 실행 합니다
         * @param   releaseCallback: function(selector, message)
         * validation 이 올바를 때 실행합니다
         * @return  Boolean
         * @author   WilsonParker
         * @added   2019-06-15
         * @updated 2019-06-15
         */
        checkPassword: function (passwordSelector, passwordCheckSelector, warningCallback, releaseCallback) {
            let password = $(passwordSelector).val();
            let num = password.search(this.reg.number);
            let eng = password.search(this.reg.eng);
            let spe = password.search(this.reg.char);

            if (password.length < 9 || password.length > 20) {
                warningCallback(passwordSelector, "비밀번호는 9자리 ~ 20자리 이내로 입력해주세요.");
                return false;
            } else {
                releaseCallback(passwordSelector);
            }
            if ((num < 0 && eng < 0) || (eng < 0 && spe < 0) || (spe < 0 && num < 0)) {
                warningCallback(passwordSelector, "영어, 숫자, 특수문자중 2가지 이상을 혼합아여 입력해 주세요.");
                return false;
            } else {
                releaseCallback(passwordSelector);
            }

            if (password != $(passwordCheckSelector).val()) {
                mm.form.alert(passwordCheckSelector, "비밀번호가 일치하지 않습니다.");
                return false;
            }
            return true;
        },

        /**
         * selector 의 값을 빈 값과 reg 로 확인하여 callback 함수에 selector, message 를 전달하여 실행합니다
         *
         * @param   validator
         * @return  boolean
         * @author   WilsonParker
         * @added   2019-08-09
         * @updated 2019-08-09
         */
        validate: function (validator) {
            let commonValidate = function (validator, value) {
                let result = false;
                if (validator.nullable && supports.object.isEmpty(value)) {
                    result = true;
                } else if (supports.object.isEmpty(value)) {
                    validator.invalidCallback(validator.selector, validator.nullMessage);
                    result = false;
                } else if (supports.object.isSet(validator.reg) && !value.match(validator.reg)) {
                    validator.invalidCallback(validator.selector, validator.message);
                    result = false;
                } else if (supports.object.isSet(validator.validateCallback)) {
                    result = validator.validateCallback(validator.selector, value, validator.invalidCallback, validator.message);
                } else {
                    result = true;
                }
                if (result && supports.object.isSet(validator.validCallback)) {
                    validator.validCallback(validator.selector, validator.message);
                }
                return result;
            };

            if (supports.object.isSet(validator.type) && validator.type == supports.validation.validatorType.fileValidator) {
                let files = $(validator.selector).prop("files");
                if (validator.nullable && files.length == 0) {
                    return true;
                } else if (!validator.nullable && files.length == 0) {
                    validator.invalidCallback(validator.selector, validator.nullMessage);
                    return false;
                } else if (supports.object.isEmpty(files[0].name)) {
                    validator.invalidCallback(validator.selector, validator.nullMessage);
                    return false;
                } else if (!supports.object.isEmpty(validator.mimeType) && validator.mimeType.indexOf(files[0].type) == "-1") {
                    validator.invalidCallback(validator.selector, validator.message);
                    return false;
                } else {
                    return true;
                }
            } else if (supports.object.isSet(validator.type) && validator.type == supports.validation.validatorType.editorValidator) {
                let _value = validator.valueCallback().replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");
                return commonValidate(validator, _value);
            } else if (supports.object.isSet(validator.type) && validator.type == supports.validation.validatorType.dateValidator) {
                let date_val = $(validator.selector).val();
                let now = new Date();
                let year = now.getFullYear();
                let mon = (now.getMonth() + 1) > 9 ? '' + (now.getMonth() + 1) : '0' + (now.getMonth() + 1);
                let day = now.getDate() > 9 ? '' + now.getDate() : '0' + now.getDate();
                let today_date = year + "-" + mon + "-" + day;

                let commonResult = commonValidate(validator, date_val);
                if (!commonResult)
                    return false;
                else if (validator.condition == "today" && today_date >= date_val) {
                    validator.invalidCallback(validator.selector, validator.message);
                    return false;
                } else {
                    return true;
                }
            } else {
                let value = $(validator.selector).val();
                return commonValidate(validator, value);
            }
        },

        /**
         * 하나 이상의 validate 를 처리할 때 사용합니다
         *
         * @param   validators
         * @return  boolean
         * @author   WilsonParker
         * @added   2019-08-09
         * @updated 2019-08-09
         */
        validates: function (validators) {
            for (let i = 0; i < supports.object.length(validators); i++) {
                let validator = validators[i];
                let validateResult = supports.validation.validate(validator);
                if (!validateResult)
                    return false;
            }
            return true;
        },

        /**
         * validator obj 를 생성합니다
         *
         * @param   selector
         * @param   reg
         * 정규식 체크에 필요한 값
         * @param   message
         * reg 검증 후 결과가 올바르지 않았을 때 전달할 message
         * @param   nullable
         * null 가능 여부
         * true | false
         * @param   nullMessage
         * nullable 검증 후 결과가 올바르지 않았을 때 전달할 message
         * @param   invalidCallback function(selector, message)
         * validate 가 무효할 경우 실행하는 callback function
         * @param   validateCallback function(selector, value, invalidCallback, message)
         * validate 를 직접 실행할 callback function*
         * @param   validCallback function(selector, message)
         * validate 가 성공할 경우 실행하는 callback function
         * @return  validator
         * @author   WilsonParker
         * @added   2019-08-09
         * @updated 2019-08-09
         */
        makeValidator: function (selector, reg, message, nullable, nullMessage, invalidCallback, validateCallback, validCallback) {
            return {
                selector: selector,
                reg: reg,
                message: message,
                nullable: nullable,
                nullMessage: nullMessage,
                invalidCallback: invalidCallback,
                validateCallback: validateCallback,
                validCallback: validCallback,
            }
        },

        /**
         * selector 대신 input[name] 을 사용하여 makeValidator 함수를 실행합니다
         *
         * @param   name
         * @param   reg
         * @param   message
         * @param   nullable
         * @param   nullMessage
         * @param   invalidCallback function(selector, message)
         * @param   validateCallback function(selector, value, invalidCallback, message)
         * @param   validCallback function(selector, message)
         * @return  validator
         * @author   WilsonParker
         * @added   2019-08-27
         * @updated 2019-08-27
         */
        makeValidatorWithName: function (name, reg, message, nullable, nullMessage, invalidCallback, validateCallback, validCallback) {
            return supports.validation.makeValidator("input[name='" + name + "']", reg, message, nullable, nullMessage, invalidCallback, validateCallback, validCallback);
        },

        /**
         *
         * fileValidator obj 를 생성합니다
         * @param selector
         * @param mimeType
         * @param message
         * @param nullable
         * @param nullMessage
         * @param invalidCallback
         * @return validator
         * @author 오세현
         * @added   2019-08-12
         * @updated 2019-08-12
         */
        makeFileValidator: function (selector, mimeType, message, nullable, nullMessage, invalidCallback) {
            return {
                type: supports.validation.validatorType.fileValidator,
                selector: selector,
                mimeType: mimeType,
                message: message,
                nullable: nullable,
                nullMessage: nullMessage,
                invalidCallback: invalidCallback,
            };
        },

        /**
         * Editor 값을 체크하는 validator
         * @param valueCallback
         * @param nullable
         * @param nullMessage
         * @param invalidCallback
         * @return  validator
         * @author  오세현
         * @added   2019-08-19
         * @updated 2019-08-19
         */
        makeEditorValueValidator: function makeValueValidator(valueCallback, nullable, nullMessage, invalidCallback) {
            return {
                type: supports.validation.validatorType.editorValidator,
                valueCallback: valueCallback,
                nullable: nullable,
                nullMessage: nullMessage,
                invalidCallback: invalidCallback,
            }
        },

        /**
         *
         * fileValidator obj 를 생성합니다
         * @param selector
         * @param condition
         * @param message
         * @param nullable
         * @param nullMessage
         * @param invalidCallback
         * @return validator
         * @author 오세현
         * @added   2019-08-12
         * @updated 2019-08-12
         */
        makeDateValidator: function (selector, condition, message, nullable, nullMessage, invalidCallback) {
            return {
                type: supports.validation.validatorType.dateValidator,
                selector: selector,
                condition: condition,
                message: message,
                nullable: nullable,
                nullMessage: nullMessage,
                invalidCallback: invalidCallback,
            };
        },


    },
    /*
     * =====================================================================================================================
     * VALIDATE
     * END
     * =====================================================================================================================
     */

    time: {
        loadAfterTime: function (callback, time) {
            setTimeout(callback, time);
        }
    },

    event: {
        props: {
            singleCheckMap: undefined,
            events: undefined,
        },
        key: {
            enter: '13'
        },

        init: function () {
            this.props.singleCheckMap = new Map();
            this.props.events = new Map();
        },

        /**
         * input[type='checkbox'] 같이 check 기능을 하나의 object 로만 관리하기 위한 기능 입니다
         *
         * @param   key: String
         * object 를 관리할 key
         * @param   obj
         * 클릭한 object
         * @param   callback: Function(checked: Boolean, data: String)
         * checked : bool , object 의 data-obj 를 parameter 로 전달합니다
         * @return
         * @author  WilsonParker
         * @added   2019-05-03
         * @updated 2019-05-03
         */
        singleCheck: function (key, obj, callback) {
            if (!this.props.singleCheckMap.has(key)) {
                this.props.singleCheckMap.set(key, undefined);
            }
            let singleClickObj = this.props.singleCheckMap.get(key);
            let data = helper.object.getDataObj(obj);
            if (obj.checked) {
                if (singleClickObj !== undefined) {
                    singleClickObj.checked = false;
                }
                singleClickObj = obj;
                callback(obj.checked, data);
            } else {
                singleClickObj = undefined;
                callback(false, data);
            }
            this.singleCheckMap.set(key, singleClickObj);
        },

        /**
         * event 객체를 생성 합니다
         *
         * @param code
         * key code
         * @param callback
         * run when key is pressed
         * @param validationCallback
         * @return Object
         * @author  dew9163
         * @added   2021/01/14
         * @updated 2021/01/14
         */
        createEvent: function (code, callback, validationCallback) {
            return {
                code: code,
                callback: callback,
                validationCallback: validationCallback,
            }
        },

        /**
         * event 객체를 등록 합니다
         * @param   code
         * @param callback
         * @param validationCallback
         * @author  dew9163
         * @added   2021/01/14
         * @updated 2021/01/14
         */
        addEventListener: function (code, callback, validationCallback) {
            this.props.events.set(code, this.createEvent(code, callback, validationCallback));
        },

        /**
         * 등록한 event 를 설정 합니다
         * @author  dew9163
         * @added   2021/01/14
         * @updated 2021/01/14
         */
        listen: function () {
            let self = this;
            $(document).keypress(function (e) {
                let keycode = (e.keyCode ? e.keyCode : e.which);
                helper.object.forEach(self.props.events, function (key, ele) {
                    let validated = helper.object.isSet(ele.validationCallback) ? ele.validationCallback() : true;
                    if (keycode == key && validated) {
                        ele.callback();
                    }
                });
            });
        },
    },
};

export {helper}
