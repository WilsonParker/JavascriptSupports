/**
 * model class
 *
 * @author  WilsonParker
 * @added   2020/12/03
 * @updated 2020/12/03
 */
const modelBuilder = {
    selector: {
        getModel: function (selector, value = undefined, key = 'data-id') {
            return value !== undefined ? $(`${selector}[${key}=${value}]`) : $(`${selector}`);
        },
        getModelItem: function (model, name, attr = 'data-name') {
            return $(model[0].querySelector(`[${attr}=${name}]`));
        },
        getModelAttribute: function (model, attr) {
            return $(model[0]).attr(attr);
        },
    },

    builder: {
        setHtml: function (model, key, data, attr) {
            modelBuilder.selector.getModelItem(model, key, attr).html(data);
        },
        setValue: function (model, key, data, attr) {
            $(modelBuilder.selector.getModelItem(model, key, attr)[0]).val(data);
        },
        setAttribute: function (model, key, attr, data, modelAttr) {
            modelBuilder.selector.getModelItem(model, key, modelAttr).attr(attr, data);
        },
        setCSS: function (model, key, css, data, modelAttr) {
            modelBuilder.selector.getModelItem(model, key, modelAttr).css(css, data);
        },

        showArrowUp: function (model) {
            this.showArrow(model, 'inline', 'none');
        },
        showArrowDown: function (model) {
            this.showArrow(model, 'none', 'inline');
        },
        showArrow: function (model, up, down) {
            let arrowUp = selector.getModelItem(model, 'arrow_up');
            let arrowDown = selector.getModelItem(model, 'arrow_down');
            $(arrowUp).css('display', up);
            $(arrowDown).css('display', down);
        },
        hiddenArrow: function (model) {
            this.showArrow(model, 'none', 'none');
        },
    }
};

export {modelBuilder}
