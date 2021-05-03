/**
 * supports script
 *
 * babel public/common/js/babel -d public/common/js -w
 * command 를 사용해서 ie 에도 적용가능한 script 로 compile 해야 합니다
 *
 * @author   WilsonParker
 * @created 2019-05-31
 * @updated 2019-08-26
 */
const supports = {
        /*
         * =====================================================================================================================
         * Object
         *
         * Variable 의 정보를 이용하기 위해 사용됩니다
         *
         * START
         * =====================================================================================================================
         */
        object: {
            properties: {
                _isDebug: true
            },

            /**
             * properties 의 _isDebug 가 true 일 때 console.log 에 출력합니다
             *
             * @param   args: varargs
             * log 를 출력할 args
             * @return
             * @author   WilsonParker
             * @added   2019-06-15
             * @updated 2019-06-15
             */
            log: function (args) {
                if (this.properties._isDebug) {
                    this.forEach(arguments, function (idx, item) {
                        console.log(item);
                    });
                }
            },

            isSet: function (val) {
                return !this.isNonSet(val);
            },
            isNonSet: function (val) {
                return (val == "" || val == '' || val == undefined || val == "undefined" || val == null || typeof val == 'undefined');
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
                return val == "" || val == '' || val == "\"\"" || val == "\'\'";
            },
            isNonEmptyString: function (val) {
                return !this.isEmptyString(val);
            },
            isEmptyObject: function (val) {
                return val == "" || val == '' || val == "\"\"" || val == "\'\'" || val == null || val == undefined;
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
                if (Array.isArray(val) || val.length != undefined)
                    return val.length;
                else
                    return val.keys != undefined ? val.size : Object.keys(val).length;
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
             * @author   WilsonParker
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
                    let v = values[element] != undefined ? values[element] : values[idx];
                    if (supports.object.isNonSet(resultCallback)) {
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
             * @author   WilsonParker
             * @added   2019-08-27
             * @updated 2019-08-27
             */
            forEachWithLength: function (collector, length = -1, callback, resultCallback, carry) {
                let keys = Object.keys(collector);
                Object.values = Object.values || this.objectValuesPolyfill;
                let values = Object.values(collector);
                let result = this.isNonSet(carry) ? "" : carry;
                let rLength = length == -1 || supports.object.isNonSet(length) ? supports.object.length(collector) : length;
                for (let idx = 0; idx < rLength; idx++) {
                    let element = keys[idx];
                    let v = values[element] != undefined ? values[element] : values[idx];
                    if (supports.object.isNonSet(resultCallback)) {
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
             * @author   WilsonParker
             * @added   2019-08-27
             * @updated 2019-08-27
             */
            getDataObj: function (obj) {
                let data = "";
                let dataObj = typeof obj === 'string' ? $(obj) : obj;
                if (dataObj.getAttribute != undefined) {
                    data = dataObj.getAttribute('data-obj');
                } else if (dataObj.attr != undefined) {
                    data = dataObj.attr('data-obj');
                }
                let json = supports.object.replaceAll(data, "\'", "\"");
                return this.isSet(json) ? JSON.parse(json) : "";
            },
            /**
             * html tag 의 attributes 중 data-obj 의 값을 설정 합니다
             *
             * @param   obj
             * @param   key
             * @param   value
             * @return  object
             * @author   WilsonParker
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
             * @author   WilsonParker
             * @added   2019-08-27
             * @updated 2019-08-27
             */
            removeDataObj: function (obj, key) {
                let data = supports.object.getDataObj(obj);
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

        /*
         * =====================================================================================================================
         * Object
         * END
         * =====================================================================================================================
         */

        /*
         * =====================================================================================================================
         * Builder
         *
         * Tag, html 등 을 생성하기 위해 사용됩니다
         *
         * START
         * =====================================================================================================================
         */

        builder: {
            /**
             * selector 에 list 데이터를 이용하여 목록 화면을 생성합니다
             *
             * @param   selector
             * list 를 생성할 selector
             * @param   list
             * list 의 data
             * @param   buildCallback
             * function(element, val, idx)
             *
             * list 를 이용하여 내용을 작성할 callback
             * @param   emptyCallback
             * function()
             *
             * list 의 데이터가 비어있을 경우 실행할 함수
             * @return  void
             * @author   WilsonParker
             * @added   2019-08-27
             * @updated 2019-08-27
             */
            buildList: function (selector, list, buildCallback, emptyCallback) {
                var target = $(selector);
                var result = "";
                if (supports.object.isEmptyArray(list)) {
                    result = emptyCallback();
                } else {
                    result = supports.object.forEach(list, buildCallback);
                }
                $(target).html(result);
            },

            /**
             * options 를 이용하여 Input 태그를 생성합니다
             *
             * @param   options
             * input tag info
             * options = { type, cls, id, name, value, attr }
             * @author   WilsonParker
             * @added   2019-05-02
             * @updated 2019-05-02
             */
            buildInputTagWithOptions: function (options) {
                return `<input type="${options.type}" class="${options.cls}" id="${options.id}" name="${options.name}" value="${options.value}" ${options.attr}/>`;
            },

            data: {
                buildSortChangedList: function (selector, newSortKey = "new_sort") {
                    let sortResultList = [];
                    supports.object.forEachWithLength($(selector), null, function (element, val, idx) {
                        supports.object.setDataObj(val, newSortKey, idx + 1);
                        let data = supports.object.getDataObj(val);
                        if (data.old_sort != data.new_sort) {
                            sortResultList.push(data);
                        }
                    });
                    return sortResultList;
                },

                buildSortAttributes: function (ix, sort) {
                    return `data-obj="{ 'ix' : '${ix}', 'old_sort' : '${sort}' }"`;
                },

                /**
                 *
                 * @param
                 * @return
                 * @author   WilsonParker
                 * @added   2019-08-20
                 * @updated 2019-08-20
                 * @Todo
                 * key 가 array 일 경우 작업 미완성
                 *
                 */
                buildDataObjList: function (arr, key) {
                    let resultList = [];
                    supports.object.forEachWithLength(arr, null, function (element, val, idx) {
                        var data = supports.object.getDataObj(val);

                        if (supports.object.isNonSet(key)) {
                            resultList.push(data);
                        } else if (supports.object.isNonEmptyArray(key)) {
                            resultList.push(
                                supports.object.forEach(key, function (element, value, idx, resultCallback, carry) {

                                })
                            );
                        } else {
                            resultList.push(data[key]);
                        }
                    });
                    return resultList;
                },

                /**
                 * name[] 으로 된 checkbox 가 선택된 element 들 또는 값을 array 로 넘겨줍니다
                 *
                 * @param   name
                 * ex) check_branches[]
                 * @param callback function (idx, element)
                 * 선택된 checkbox list 에 map 함수를 사용하기 위한 callback
                 * 현재의 idx (순서) 와 element(테그) 를 넘겨받습니다
                 *
                 * default : data-obj:"{ 'ix' : 1 }"
                 * 위의 ix 를 결과로 넘겨줍니다
                 * @return
                 * @author   WilsonParker
                 * @added   2019-08-19
                 * @updated 2019-08-19
                 */
                buildCheckedListData: function (name, callback) {
                    let fun = supports.object.isFunction(callback) ? callback : function (idx, element) {
                        return supports.object.getDataObj(element).ix;
                    };
                    return $("input[name='" + name + "']:checked").map(fun).toArray();
                }
            }
        },


        /*
         * =====================================================================================================================
         * Builder
         * END
         * =====================================================================================================================
         */

        /*
         * =====================================================================================================================
         * Converter
         *
         * 데이터를 변환하기 위해 사용합니다
         *
         * START
         * =====================================================================================================================
         */

        converter: {
            /**
             * form 을 가리키는 formSelector 를 이용하여 GET URL 을 생성합니다
             *
             * @param   formSelector
             * URL 로 변환할 form Tag
             * @author   WilsonParker
             * @added   2019-05-02
             * @updated 2019-05-02
             */
            convertFormToUrl: function (formSelector) {
                let frm = $(formSelector);
                let url = frm.attr("action");
                let inputs = frm.find("input");
                let params = inputs.toArray().filter(item => supports.object.isNonEmptyString(item.value));
                params = params.map(item => item.name + "=" + item.value);
                return url + "?" + params.join("&");
            },

            /**
             * form 을 가리키는 formSelector 를 이용하여 DataObject 을 생성합니다
             *
             * @param   formSelector
             * DataObject 로 변환할 form Tag
             * @return  Object
             * @author   WilsonParker
             * @added   2019-05-14
             * @updated 2019-05-14
             */
            convertFormToDataObject: function (formSelector) {
                let frmData = $(formSelector).serialize();
                let params = frmData.split("&").filter(item => supports.object.isNonEmptyString(item.value));
                let returnCallback = function (carry, key, val) {
                    carry[key] = val;
                };
                let result = supports.object.forEach(params, function (element, value, idx, returnCallback, carry) {
                    var obj = value.split("=");
                    return returnCallback(carry, obj[0], obj[1])
                }, returnCallback, {});
                return result;
            },

            /**
             * form 을 가리키는 formSelector 의 input tag 를 이용하여 DataObject 을 생성합니다
             *
             * @param   formSelector
             * DataObject 로 변환할 form Tag
             * @return  Object
             * @author   WilsonParker
             * @added   2019-05-14
             * @updated 2019-05-14
             */
            convertFormInputToDataObject: function (formSelector) {
                let frm = $(formSelector);
                let inputs = frm.find("input");
                let params = inputs.toArray().filter(item => supports.object.isNonEmptyString(item.value));
                let returnCallback = function (carry, key, val) {
                    carry[key] = val;
                };
                let result = supports.object.forEach(params, function (element, value, idx, returnCallback, carry) {
                    return returnCallback(carry, value.name, value.value)
                }, returnCallback, {});
                return result;
            },
        },

        /*
         * =====================================================================================================================
         * Converter
         * END
         * =====================================================================================================================
         */

        /*
         * =====================================================================================================================
         * Function
         *
         * Function 의 모음 입니다
         *
         * START
         * =====================================================================================================================
         */
        functions: {

            axios: {
                call: function (_options) {
                    let options = $.extend(true, {
                        url: "",
                        method: 'GET',
                        data: {},
                        cache: false,
                        responseType: 'json',
                        /*
                         * Functions
                         */
                        onSuccess: function (result) {
                        },
                        onError: function (result) {
                        },
                    }, _options);

                    axios({
                        url: options.url,
                        method: options.method,
                        responseType: options.responseType,
                        params: options.data,
                    })
                        .then(function (response) {
                            options.onSuccess(response);
                        })
                        .catch(function (error) {
                            options.onError(error);
                        })
                }
            },

            mmAxios: {
                call: function (_options) {
                    let options = $.extend(true, {
                        url: "",
                        method: 'GET',
                        data: {},
                        cache: false,
                        responseType: 'json',
                        /*
                         * Functions
                         */
                        onSuccess: function (result) {
                        },
                        onError: function (result) {
                        },
                    }, _options);

                    axios({
                        url: options.url,
                        method: options.method,
                        responseType: options.responseType,
                        params: options.data,
                    })
                        .then(function (response) {
                            options.onSuccess(response);
                        })
                        .catch(function (error) {
                            options.onError(error);
                        })
                }
            },

            ajax: {
                call: function (_options) {
                    let options = $.extend(true, {
                        url: "",
                        method: 'GET',
                        data: {},
                        cache: false,
                        responseType: 'json',
                        /*
                         * Functions
                         */
                        onSuccess: function (result) {
                        },
                        onError: function (result) {
                        },
                    }, _options);

                    $.ajax({
                        url: options.url,
                        method: options.method,
                        type: options.responseType,
                        cache: options.cache,
                        data: options.data,
                        success: function (result) {
                            options.onSuccess(result);
                        },
                        error: function (result) {
                            options.onError(result);
                        }
                    });
                }
            },
        },
        /*
         * =====================================================================================================================
         * Function
         * END
         * =====================================================================================================================
         */

        /*
         * =====================================================================================================================
         * HTML
         *
         * html 데이터를 설정할 때 사용합니다
         *
         * START
         * =====================================================================================================================
         */
        html: {

            /**
             * name 에 해당하는 input 의 기본값을 설정하여 $frm_search 에 추가합니다
             *
             * @param   name
             * input 의 이름 또는 이름 배열 입니다
             * @param   value
             * input 의 들어갈 값 또는 값 배열 입니다
             * @author   WilsonParker
             * @added   2019-04-22
             * @updated 2019-05-02
             */
            appendInputBasicValueAndSubmit: function (name, value, formSelector) {
                if (Array.isArray(name)) {
                    for (let i = 0; i < name.length; i++) {
                        let options = {
                            'type': "hidden",
                            'name': name[i],
                            'value': value[i]
                        };
                        $(formSelector).append(supports.builder.buildInputTagWithOptions(options));
                    }
                }
                let options = {
                    'type': "hidden",
                    'name': name,
                    'value': value
                };
                $(formSelector).append(supports.builder.buildInputTagWithOptions(options));
                $(formSelector).submit();
            },

            /**
             * selector 에 해당하는 input 의 값을 설정합니다
             * input 데이터를 설정하면서 validator callback 함수를 실행하여
             * 알림창을 띄우고 성공 여부를 전달합니다
             *
             * @param   selector
             * 하나 또는 배열 입니다
             * @param   value
             * 하나 또는 배열 입니다
             * @author   WilsonParker
             * @added   2019-04-22
             * @updated 2019-05-02
             */
            setInputValue: function (selector, value, validator) {
                let success = true;
                if (Array.isArray(selector)) {
                    supports.object.forEach(selector, function (idx, item) {
                        $(item).val(value[idx]);
                        if (supports.object.isSet(validator))
                            success &= validator($(item), value[idx]);
                    });
                } else {
                    if (supports.object.isSet(validator))
                        success &= validator($(selector), value);
                    $(selector).val(value);
                }
                return success;
            },

            /**
             * setInputValue 함수 에서  selector 를 input[name] 으로 가져옵니다
             *
             * @param   name
             * input 의 이름 또는 이름 배열 입니다
             * @param   value
             * input 의 들어갈 값 또는 값 배열 입니다
             * @author   WilsonParker
             * @added   2019-04-22
             * @updated 2019-05-02
             */
            setInputValueWithName: function (name, value, validator) {
                const converter = function (name) {
                    return `input[name='${name}']`;
                };
                if (supports.object.isNonEmptyArray(name)) {
                    return this.setInputValue(name.map(converter), value, validator);
                } else {
                    return this.setInputValue(converter(name), value, validator);
                }
            },

            /**
             * setInputValue 함수를 실행한 후에 formSelector 를 submit 합니다
             *
             * @param   selector
             * @param   value
             * @param   formSelector
             * @param   validator
             * @author   WilsonParker
             * @added   2019-08-27
             * @updated 2019-08-27
             */
            setInputValueAndSubmit: function (selector, value, formSelector, validator) {
                let success = this.setInputValue(selector, value, validator);
                if (success) $(formSelector).submit();
            },

            /**
             * selector 대신 input[name] 을 이용하여 setInputValueAndSubmit 함수를 실행합니다
             *
             * @param   name
             * @param   value
             * @param   formSelector
             * @param   validator
             * @author   WilsonParker
             * @added   2019-08-27
             * @updated 2019-08-27
             */
            setInputValueAndSubmitWithName: function (name, value, formSelector, validator) {
                let success = this.setInputValueWithName(name, value, validator);
                if (success) $(formSelector).submit();
            },

            /**
             * setInputValue 함수를 실행한 후에 complete 함수를 실행합니다
             *
             * @param   selector
             * @param   value
             * @param   complete
             * @param   validator
             * @author   WilsonParker
             * @added   2019-08-27
             * @updated 2019-08-27
             */
            setInputValueWithCompleteAction: function (selector, value, complete, validator) {
                let success = this.setInputValue(selector, value, validator);
                if (success) complete();
            },
            /**
             * setInputValueWithName 함수를 실행한 후에 complete 함수를 실행합니다
             *
             * @param   name
             * @param   value
             * @param   complete
             * @param   validator
             * @author   WilsonParker
             * @added   2019-08-27
             * @updated 2019-08-27
             */
            setInputValueWithNameAndCompleteAction: function (name, value, complete, validator) {
                let success = this.setInputValueWithName(name, value, validator);
                if (success) complete();
            },

        },

        /*
         * =====================================================================================================================
         * HTML
         * END
         * =====================================================================================================================
         */

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
                    $(this).val(v.replace(allowReg, ""));
                });
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
                    let selector = $(validator.selector);
                    let value = undefined;
                    if (selector.length > 1) {
                        value = selector.map(function () {
                            return $(this).val();
                        }).get();
                    } else {
                        value = selector.val();
                    }
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

        /*
         * =====================================================================================================================
         * Event
         *
         * onclick, onchange 등 과 같이 event 를 발생한 object 가 존재할 경우 사용합니다
         * function 의 parameter 로 Tag 정보를 넘겨주어 사용합니다
         *
         * START
         * =====================================================================================================================
         */

        event: {
            key: {
                enter: '13'
            }
            ,
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
             * @author   WilsonParker
             * @added   2019-05-03
             * @updated 2019-05-03
             */
            singleCheckMap: new Map(),
            singleCheck:
                function (key, obj, callback) {
                    if (!this.singleCheckMap.has(key)) {
                        this.singleCheckMap.set(key, undefined);
                    }
                    let singleClickObj = this.singleCheckMap.get(key);
                    let data = supports.object.getDataObj(obj);
                    if (obj.checked) {
                        if (singleClickObj != undefined) {
                            singleClickObj.checked = false;
                        }
                        singleClickObj = obj;
                        callback(obj.checked, data);
                    } else {
                        singleClickObj = undefined;
                        callback(false, data);
                    }
                    this.singleCheckMap.set(key, singleClickObj);
                }

            ,

            /**
             * onKeyPress function 에 사용될 객체 입니다
             *
             * @param   code: String
             * 입력한 key 의 code
             * @param   condition: function(): Boolean
             * code 가 일치하고 추가로 실행 여부를 return 합니다
             * @param   event: function()
             * keycode 와 condition 이 true 일 때 실행됩니다
             *
             * @author   WilsonParker
             * @added   2019-06-10
             * @updated 2019-06-10
             */
            onKeyPressObj: function (code, condition, event) {
                this.code = code;
                this.condition = condition;
                this.event = event;
            }
            ,
            /**
             * Key 를 입력했을 때 실행됩니다
             * 입력한 keycode 와 onKeyPressObj.code 가 일치하고, onKeyPressObj.condition 이 true 일 때
             * onKeyPressObj.event 를 실행합니다
             *
             * @param   onKeyPressObj
             * @return
             * @author   WilsonParker
             * @added   2019-06-10
             * @updated 2019-06-10
             */
            onKeypress: function (onKeyPressObj) {
                $(document).keypress(function (e) {
                    let keycode = (e.keyCode ? e.keyCode : e.which);
                    supports.object.forEach(onKeyPressObj, function (key, ele) {
                        if (keycode == ele.code && ele.condition()) {
                            ele.event();
                        }
                    });
                });
            }
            ,
        },

        /*
         * =====================================================================================================================
         * Event
         * END
         * =====================================================================================================================
         */

        /*
         * =====================================================================================================================
         * Window
         * START
         * =====================================================================================================================
         */
        window: {
            /**
             * 새로운 창을 url 로 이동 시킵니다
             *
             * @param   url string
             * @author  dew9163
             * @added   2021/04/13
             * @updated 2021/04/13
             */
            open: function (url) {
                window.open(url, '_blank');
            },
        },
        /*
         * =====================================================================================================================
         * window
         * END
         * =====================================================================================================================
         */

        /**
         * length 만큼 random 으로 token 을 생성합니다
         *
         * @param   length
         * @return
         * @author   WilsonParker
         * @added   2019-08-27
         * @updated 2019-08-27
         */
        code: {
            generateToken: function (length) {
                //edit the token allowed characters
                const a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
                let b = [];
                for (let i = 0; i < length; i++) {
                    let j = (Math.random() * (a.length - 1)).toFixed(0);
                    b[i] = a[j];
                }
                return b.join("");
            }
        }
    }
;

export {supports}
