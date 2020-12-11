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

    attribute: {
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

        getDataID: function (model) {
            return $(model).attr('data-id');
        },
        getDataName: function (model) {
            return $(model).attr('data-name');
        },
        getDataNumber: function (model) {
            return $(model).attr('data-number');
        },
    },

    builder: {
        multipleInput: {
            props: {
                number: 1,
                selector: '',
                id: '',
                name: '',
                data: [],
                label: 'label',
                placeHolder: 'blank',
            },
            classes: {
                div: '',
                label: '',
                container: 'form-multiple-container',
                wrapper: 'form-multiple-wrapper',
                input: 'form-multiple-input',
                addButton: 'form-multiple-add-button',
                deleteButton: 'form-multiple-delete-button',
            },
            event: {
                /**
                 * function (id, name)
                 */
                onAdd: undefined,
                /**
                 * function (id, number)
                 */
                onRemove: undefined,
            },

            init: function (selector, id, name, label, data) {
                this.props.selector = selector;
                this.props.id = id;
                this.props.name = name;
                this.props.label = label;
                this.props.data = data;

                this.builder.init(selector, id, name, data);
            },

            initScript: function () {
                let self = this;
                $(`.${this.classes.addButton}`).on('click', function () {
                    let id = modelBuilder.attribute.getDataID(this);
                    let name = modelBuilder.attribute.getDataName(this);
                    if (self.event.onAdd === undefined) {
                        self.builder.appendInput(id, name);
                    } else {
                        self.event.onAdd(id, name);
                    }
                });

                let script = document.createElement("script");
                // Add script content
                script.innerHTML = `
                    function removeInput(obj) {
                        let id = modelBuilder.attribute.getDataID(obj);
                        let number = modelBuilder.attribute.getDataNumber(obj);
                        if(self.event.onRemove === undefined) {
                            modelBuilder.builder.multipleInput.builder.removeInput(id, number);
                        } else {
                            self.event.onRemove(id, number);
                        }
                    }
                `;
                // Append
                document.head.appendChild(script);
            },

            selector: {
                root: function () {
                    return modelBuilder.builder.multipleInput;
                },
                getContainer: function (id) {
                    return $(`.${this.root().classes.container}[data-id='${id}']`);
                },
                getWrapper: function (id, number) {
                    return $(this.getContainer(id))[0].querySelector(`.${this.root().classes.wrapper}[data-id='${id}'][data-number='${number}']`);
                },
            },

            builder: {
                init: function (selector, id, name, data) {
                    let self = this;
                    $(selector).append(this.buildContainer(id, name));

                    let callback = function (element, value, idx, resultCallback, carry) {
                        self.appendInput(id, name, value);
                    };
                    if (helper.object.isSet(data)) {
                        helper.object.forEach(JSON.parse(data), callback);
                    }
                },

                appendInput: function (id, name, data) {
                    $(this.root().selector.getContainer(id)).append(this.buildInput(id, name, data));
                    this.root().props.number++;
                },

                removeInput: function (id, number) {
                    $(this.root().selector.getWrapper(id, number)).remove();
                },

                buildContainer: function (id, name) {
                    return `
                        <div class="${this.root().classes.div} form-multiple-input">
                            <label class="${this.root().classes.label}" for="${id}">${this.root().props.label}
                                <button type="button" class="btn btn-success form-multiple-add-button" ${this.buildAttrDataID(id)} ${this.buildAttrDataName(name)} >+</button>
                            </label>
                            <div class="form-multiple-container" ${this.buildAttrDataID(id)}>
                            </div>
                        </div>
                    `;
                },

                buildInput: function (id, name, data) {
                    let value = '';
                    let number = undefined;
                    if (helper.object.isSet(data)) {
                        value = helper.object.isSet(data.value) ? data.value : '';
                        number = helper.object.isSet(data.number) ? data.number : undefined;
                    }

                    return `
                        <div class="input-group mb-3 ${this.root().classes.wrapper}" ${this.buildAttrDataID(id)} ${this.buildAttrDataNumber(number)} >
                            <input type="text" class="form-control ${this.root().classes.input}" name="${name}[]" placeholder="${this.root().props.placeHolder}" aria-label="${this.root().props.placeHolder}" ${this.buildAttrDataID(id)} ${this.buildAttrDataNumber(number)} value="${value}">
                            <div class="input-group-append">
                                <button class="btn btn-danger ${this.root().classes.deleteButton}" type="button" ${this.buildAttrDataID(id)} ${this.buildAttrDataNumber(number)} onclick="removeInput(this)">-</button>
                            </div>
                        </div>
                    `;
                },

                buildAttrDataID: function (id) {
                    return `data-id="${id}"`;
                },
                buildAttrDataName: function (name) {
                    return `data-name="${name}"`;
                },

                buildAttrDataNumber: function (number) {
                    let data = helper.object.isSet(number) ? number : this.root().props.number;
                    return `data-number="${data}"`;
                },

                root: function () {
                    return modelBuilder.builder.multipleInput;
                }
            },
        },
    }
};

export {modelBuilder}
