/**
 * 전역으로 사용할 javascript
 *
 * @author  dew9163
 * @added   2020/08/03
 * @updated 2020/10/15
 */

const helper = {
    /**
     * initialize helper
     *
     * @author  dew9163
     * @added   2020/08/13
     * @updated 2020/08/13
     */
    initialize: function () {
        this.cookie.init();
    },

    logger: {
        log: function (message) {
            console.log(message);
        }
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
         * @author  dew9163
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
         * @author  dew9163
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
         * @author  dew9163
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
         * @author  dew9163
         * @added   2020/08/13
         * @updated 2020/08/13
         */
        addQueryString: function (key, value) {
            let params = this.getUrlParams();
            params[key] = value;
            return this.buildQueryString(params);
        },
    }
};

export {helper}
