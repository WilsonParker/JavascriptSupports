/**
 * modal class
 *
 * @author  WilsonParker
 * @added   2020/12/01
 * @updated 2020/12/08
 */
const modal = {
    props: {
        id: 'componentModal',
        dismissEvent: function () {

        },
    },
    init: function (id) {
        this.props.id = id;
    },

    show: function () {
        this.selector.getModal().modal('show');
    },

    confirm: function (message, callback) {
        if(confirm(message)) {
            callback();
        }
    },

    selector: {
        getModal: function () {
            return $('#' + modal.props.id);
        },
        getTitleModal: function () {
            return $(this.getModal()[0].querySelector('.modal-title'));
        },
        getContentModal: function () {
            return $(this.getModal()[0].querySelector('.modal-body'));
        },
    },

    builder: {
        setTitle(title) {
            modal.selector.getTitleModal().html(title);
        },
        setContent(content) {
            modal.selector.getContentModal().html(content);
        },

        setDissmissEvent(event) {
            modal.props.dismissEvent = event;
        },

        parse(data) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(data, 'text/html');
            return doc;
        },
    },

    setTitle(title) {
        this.builder.setTitle(title);
    },
    setContent(content) {
        this.builder.setContent(content);
    },

};

export {modal}
