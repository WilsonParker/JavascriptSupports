/*
 * summernote js
 * <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js"></script>
 */

/**
 * @author  WilsonParker
 * @added   2020/12/03
 * @updated 2020/12/03
 */
const summernoteEditor = {
    props: {
        class: 'editor-summernote',
        onImageUploadCallback: undefined,
    },
    attributes: {
        height: 300,
        callbacks: undefined,
    },

    init: function () {
        $('.' + this.props.class).summernote(this.attributes);
    },

    getOnImageUploadCallback: function (files, editor, welEditable) {
        for (var i = files.length - 1; i >= 0; i--) {
            this.props.onImageUploadCallback(files[i], this);
        }
    }
};

export {summernoteEditor}
