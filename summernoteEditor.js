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

    init: function (options) {
        $('.' + this.props.class).summernote(Object.assign(this.attributes, options));
    },

    /**
     * textarea 에 사용한 정보를 summernote 에 적용 합니다
     * summernoteEditor.bind('.editor-container','data-class','textarea');
     * @param selector
     * summernote 와 textarea 를 포함하는 selector
     * @param attr
     * textarea 에서 가져올 attr
     * @param target
     * textarea selector
     * @author  dew9163
     * @added   2020/12/17
     * @updated 2020/12/17
     */
    bind : function(selector, attr, target) {
        let selectors = $(selector);
        for(let i=0;i<selectors.length;i++) {
            let container = selectors[i];
            let area = container.querySelector('.note-editing-area');
            let textarea = container.querySelector(target);
            let dataClass = $(textarea).attr(attr);
            $(area.querySelector('.note-editable')).addClass(dataClass)
        }
    },

    getOnImageUploadCallback: function (files, editor, welEditable) {
        for (var i = files.length - 1; i >= 0; i--) {
            this.props.onImageUploadCallback(files[i], this);
        }
    }
};

export {summernoteEditor}
