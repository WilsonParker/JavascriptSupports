/**
 * modal class
 *
 * @author  WilsonParker
 * @added   2020/12/01
 * @updated 2021/12/24
 */
const modal = {
    props: {
        id: 'componentModal',
        confirm_id: 'confirmComponentModal',
        dismissEvent: undefined,
        confirmEvent: undefined,
    },
    init: function (id) {
        this.props.id = id;
    },

    show: function (id = modal.props.id) {
        this.selector.getModal(id).modal('show');
    },

    hide: function (id = modal.props.id) {
        this.selector.getModal(id).modal('hide');
    },

    confirm: function (message, callback) {
        this.setContent(message, modal.props.confirm_id);
        // this.builder.setConfirmEvent(callback);
        let self = this;
        this.selector.getConfirmButton(modal.props.confirm_id).on('click', function() {
            self.hide(modal.props.confirm_id);
            callback();
        });
        this.show(modal.props.confirm_id);
    },

    error: function (error) {
        this.setContent(error.response.data.message);
        this.show();
    },

    selector: {
        getModal: function (id = modal.props.id) {
            return $('#' + id);
        },
        getTitleModal: function (id = modal.props.id) {
            return $(this.getModal(id)[0].querySelector('.modal-title'));
        },
        getContentModal: function (id = modal.props.id) {
            return $(this.getModal(id)[0].querySelector('.modal-body'));
        },
        getConfirmButton: function (id = modal.props.id) {
            return $(this.getModal(id)[0].querySelector('button[btn-type="confirm"]'));
        },
    },

    builder: {
        setTitle(title, id = modal.props.id) {
            modal.selector.getTitleModal(id).html(title);
        },
        setContent(content, id = modal.props.id) {
            modal.selector.getContentModal(id).html(content);
        },

        setDismissEvent(event) {
            modal.props.dismissEvent = event;
        },

        setConfirmEvent(event) {
            modal.props.confirmEvent = event;
        },

        parse(data) {
            let parser = new DOMParser();
            let doc = parser.parseFromString(data, 'text/html');
            return doc;
        },
    },

    setTitle(title, id = modal.props.id) {
        this.builder.setTitle(title, id);
    },
    setContent(content, id = modal.props.id) {
        this.builder.setContent(content, id);
    },

};

export {modal}
