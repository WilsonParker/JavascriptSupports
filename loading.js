/**
 * loading class
 *
 * @author  WilsonParker
 * @added   2020/09/22
 * @updated 2020/10/12
 */
const loading = {
    props: {
        id: 'loading'
    },
    data: {
        isBooted: false,
        modal: null,
        callback: null,
    },
    initialize: function () {
        this.data.isBooted = true;

        this.modal = $('#' + this.props.id).modal({
            backdrop: 'static',
            keyboard: false,
        });

        this.modal.on('shown.bs.modal', function () {
            loading.data.callback();
        })
    },

    /**
     * url 로 이동합니다
     *
     * @param   url string
     * @author  dew9163
     * @added   2021/04/13
     * @updated 2021/04/13
     */
    locateUrl: function (url) {
        let callback = function () {
            location.href = url;
        };
        this.run(callback);
    },
    run: function (callback) {
        if (!this.data.isBooted) {
            loading.initialize();
            this.hide();
        }
        this.data.callback = callback;
        this.show();
    },
    show: function () {
        this.modal.modal('show');
    },
    hide: function () {
        this.modal.modal('hide');
    }
};

export {loading}
