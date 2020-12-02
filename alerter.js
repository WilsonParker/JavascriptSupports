/**
 * alerter class
 *
 * @author  WilsonParker
 * @added   2020/11/02
 * @updated 2020/11/02
 */
const alerter = {
    props: {
        id: 'alert'
    },
    show: function (message) {
        alert(message);
    },
};

export {alerter}
