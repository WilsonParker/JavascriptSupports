/**
 * modal class
 *
 * @author  dew9163
 * @added   2020/12/01
 * @updated 2020/12/01
 */
const modal = {
    props: {
        id: 'modal'
    },
    init: function (id) {
        this.props.id = id;
    },

    show: function () {
        this.selector.getModal().modal('show');
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
    },

    setTitle(title) {
        this.builder.setTitle(title);
    },
    setContent(content) {
        this.builder.setContent(content);
    },

};

export {modal}
