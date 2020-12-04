/**
 * validator class
 *
 * @author  WilsonParker
 * @added   2020/12/02
 * @updated 2020/12/02
 */
const validator = {
    props: {
        showMessageCallback: undefined,
        validators: []
    },

    init: function () {
        this.props.showMessageCallback = undefined;
        this.initValidators();
    },
    initValidators: function () {
        this.props.validators = [];
    },

    /**
     * 메시지를 띄우기 위한 callback 설정
     * 초기화가 필요합니다
     *
     * @author  WilsonParker
     * @added   2020/12/02
     * @updated 2020/12/02
     */
    setShowMessageCallback: function (callback) {
        this.props.showMessageCallback = callback;
    },

    showMessage: function (message) {
        this.props.showMessageCallback(message);
    },

    addValidator: function (validator) {
        this.props.validators.push(validator);
    },
    validate: function () {
        for (let i = 0; i < this.props.validators.length; i++) {
            let validator = this.props.validators[i];
            if (!validator.callback()) {
                if (helper.object.isSet(validator.invalidCallback) && helper.object.isFunction(validator.invalidCallback)) {
                    validator.invalidCallback(validator.params);
                } else {
                    this.showMessage(validator.message);
                }
                return false;
            }
        }
        return true;
    },

    builder: {
        type: {},

        buildValidator: function (callback, params, message, invalidCallback = undefined) {
            return {
                callback: callback,
                params: params,
                message: message,
                /*
                 * function(params, invalidMessage)
                 * */
                invalidCallback: invalidCallback,
            }
        },

        /**
         * input 필수값 value를 체크합니다.
         * @author  seul
         * @added   2020/12/03
         * @updated 2020/12/03
         */
        buildRequiredValidator : function (selector, message, invalidCallback) {
            let value = $(selector).val().trim();
            let callback = function () {
                return value;
            }

            return this.buildValidator(callback, arguments, message, invalidCallback)
        },

        /**
         * checkbox 의 최대 선택 가능한 수를 검사 합니다
         * @author  dew9163
         * @added   2020/12/02
         * @updated 2020/12/02
         */
        buildCheckBoxMaxSelectableValidator: function (selector, size, message, invalidCallback) {
            let selectedSize = $(selector + ':checked').length;
            let callback = function () {
                return size > 0 && selectedSize <= size
            };
            return this.buildValidator(callback, arguments, message, invalidCallback)
        },

        /**
         * checkbox 의 최소 선택 가능한 수를 검사 합니다
         * @author  dew9163
         * @added   2020/12/02
         * @updated 2020/12/02
         */
        buildCheckBoxMinSelectableValidator: function (selector, size, message, invalidCallback) {
            let selectedSize = $(selector + ':checked').length;
            let callback = function () {
                return size > 0 && selectedSize >= size
            };
            return this.buildValidator(callback, arguments, message, invalidCallback)
        },
    },
};

export {validator}
