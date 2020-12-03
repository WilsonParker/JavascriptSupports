/**
 * result class
 *
 * @author  seul
 * @added   2020/12/02
 * @updated 2020/12/02
 */
const result = {
    props: {

    },

    init: function () {

    },

    selector : {
        getModel: function (name, attr = 'data-name') {
            return $(`[${attr}=${name}]`);
        },
    },

    builder : {
        setData: function (name, data) {
            result.selector.getModel(name).html(data);
        },
        setImage: function (name, data) {
            result.selector.getModel(name).attr('src', data);
        },
    },
};

export {result}
