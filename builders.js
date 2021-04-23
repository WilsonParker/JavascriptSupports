/**
 *
 * @author  dew9163
 * @added   2021/04/21
 * @updated 2021/04/21
 */
const builders = {
    selectWithCheckBox: {
        properties: {
            classes: {
                sectionContainer: 'swc-section-container',
                section: 'swc-section',
                select: 'swc-select',
                checkbox: 'swc-checkbox',
                checkboxAll: 'swc-checkbox-all',
                addButton: 'swc-add-button',
                deleteButton: 'swc-delete-button',
                form: 'swc-form',
            },
            ids: {
                form: 'swc-form',
                sectionContainer: 'swc-section-container',
                container: 'swc-container',
                addButton: 'swc-add-btn',
            },
            dataNames: {
                select: 'select',
                section: 'section',
                sectionContainer: 'section-container',
                checkBoxContainer: 'checkbox-container',
            },
        },
        /**
         *
         * @param   buildOptionTagCallback
         * 반드시 buildSelectOptionTagParams 함수를 호출하여 return 해야 합니다
         * function(data) {
         *     return buildSelectOptionTagParams(val, text, item);
         * }
         * @param   buildCheckBoxTagCallback
         * 반드시 buildSelectOptionTagParams 함수를 호출하여 return 해야 합니다
         * function(instanceID, selectID, data) {
         *     return buildCheckBoxTagParams(instanceID, selectID, val, text);
         * }
         * @param   name
         * @param   name
         * @author  dew9163
         * @added   2021/04/22
         * @updated 2021/04/22
         */
        init: function (buildOptionTagCallback, buildCheckBoxTagCallback, name) {
            this.setBuildOptionTagCallback(buildOptionTagCallback);
            this.setBuildCheckBoxTagCallback(buildCheckBoxTagCallback);
            this.setName(name);

            this.builder.init(this);
            this.listener.init(this);
            this.event.init(this);
        },
        newInstance: function (buildOptionTagCallback, buildCheckBoxTagCallback, name) {
            let instance = _.cloneDeep(this);
            instance.setCount(this.getCount());
            instance.init(buildOptionTagCallback, buildCheckBoxTagCallback, name);
            this.addCount();
            return instance;
        },
        complete: function () {
            this.listener.addButtonClickListener();
            this.listener.deleteButtonClickListener();
            this.listener.selectChangeListener();
        },
        data: {
            name: undefined,
            id: undefined,
            json: undefined,
            count: 1,
        },
        callback: {
            buildOptionTagCallback: undefined,
            buildCheckBoxTagCallback: undefined,
        },
        builder: {
            parent: undefined,
            data: {
                sectionCount: 1,
                checkBoxCount: 1,
            },
            init: function (instance) {
                this.parent = instance;
                this.data.sectionCount = 1;
                this.data.checkBoxCount = 1;
            },
            build: function (selector) {
                $(selector).html(this.buildTemplate());
            },
            buildTemplate: function () {
                let instanceID = this.parent.getCount();
                let sectionID = this.getSectionCount();
                let html = `
                <form id="${this.parent.getIDs().form}_${instanceID}">
                <div class="${this.parent.getClasses().sectionContainer}" data-name="${this.parent.getDataNames().sectionContainer}" data-instance-id="${instanceID}" data-id="${sectionID}">
                        <div class="row">
                            <div class="col-3">`;

                html += this.buildAddButtonTag(instanceID);
                html += `
                        </div>
                    </div>
                    <br/>
                `;
                html += this.buildSection(instanceID);
                html += `
                    </div>
                </form>
                `;
                return html;
            },
            buildSection: function (instanceID) {
                let sectionID = this.getSectionCount();

                let html = `
                <div class="${this.parent.getClasses().section}" data-name="${this.parent.getDataNames().section}" data-instance-id="${instanceID}" data-id="${sectionID}">
                    <div class="row">
                        <div class="col-3" data-name="${this.parent.getDataNames().sectionContainer}" data-instance-id="${instanceID}" data-id="${sectionID}" >
                    `;
                html += this.buildSelectTag(instanceID, sectionID);
                html += `</div>`;
                html += `
                    <div class="col-lg">
                        <div class="container">
                            <div class="row" data-name="${this.parent.getDataNames().checkBoxContainer}" data-instance-id="${instanceID}" data-section-id="${sectionID}">
                            </div>
                        </div>
                    </div>
                `;
                html += this.buildDeleteButtonTag(instanceID, sectionID);
                html += `
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                `;
                this.addSectionCount();
                return html;
            },
            buildAddButtonTag: function (instanceID) {
                return `
                    <button type="button" class="btn btn-success ${this.parent.getClasses().addButton}" data-instance-id="${instanceID}">추가</button>
                `;
            },
            buildDeleteButtonTag: function (instanceID, sectionID) {
                return `
                <div class="col-1" data-name="delete-button-container" data-instance-id="${instanceID}" data-section-id="${sectionID}">
                    <button type="button" class="btn btn-danger ${this.parent.getClasses().deleteButton}" data-instance-id="${instanceID}" data-section-id="${sectionID}">삭제</button>
                </div>
                `;
            },
            buildSelectTag: function (instanceID, sectionID) {
                let html = `
                <select class="custom-select ${this.parent.getClasses().select}" data-name="${this.parent.getDataNames().select}" data-instance-id="${instanceID}" data-section-id="${sectionID}">
                    <option value="" data-items="[]">전체</option>
                `;

                let self = this;
                helper.object.forEach(this.parent.getJsonData(), function (element, value, idx, resultCallback, carry) {
                    html += self.parent.callback.buildOptionTagCallback(value);
                }, undefined, html);
                html += '</select>';
                return html;
            },
            /**
             * option tag 를 생성하기 위해 필요한 parameter 를 전달 받습니다
             *
             * @param   val
             * @param   text
             * @param   item
             * 생성할 checkbox data
             * @return  string
             * @author  dew9163
             * @added   2021/04/22
             * @updated 2021/04/22
             */
            buildSelectOptionTagParams: function (val, text, item) {
                return this.buildSelectOptionTag(val, text, item);
            },

            /**
             * checkbox tag 를 생성하기 위해 필요한 parameter 를 전달 받습니다
             *
             * @param   instanceID
             * @param   sectionID
             * @param   value
             * @param   text
             * @param   classes
             * @return  string
             * @author  dew9163
             * @added   2021/04/22
             * @updated 2021/04/22
             */
            buildCheckBoxTagParams: function (instanceID, sectionID, value, text, classes = "") {
                return this.buildCheckBoxTag(instanceID, sectionID, value, text, classes);
            },
            buildSelectOptionTag: function (val, text, item) {
                return `<option value='${val}' data-items='${item}'>${text}</option>`;
            },
            buildCheckBoxTag: function (instanceID, sectionID, value, text, classes = "") {
                let id = `${this.parent.getName()}_${instanceID}_${sectionID}_${this.getCheckBoxCount()}`;
                return `
                <div class="col-3">
                    <input type="checkbox" id="${id}" name="${this.parent.getName()}" class="form-check-input ${classes}" value="${value}" data-instance-id="${instanceID}" data-section-id="${sectionID}">
                    <label class="form-check-label" for="${id}">${text}</label>
                </div>
                `;
            },
            appendCheckBoxTag: function (select, data) {
                let self = this;
                let instanceID = modelBuilder.attribute.getDataAttribute(select, 'data-instance-id');
                let sectionID = modelBuilder.attribute.getDataAttribute(select, 'data-section-id');
                let html = '';
                this.setCheckBoxCount(1);

                html += this.buildCheckBoxTagParams(instanceID, sectionID, $(select).val(), '모두', this.parent.getClasses().checkboxAll);
                self.addCheckBoxCount();
                helper.object.forEach(JSON.parse(data), function (element, value, idx, resultCallback, carry) {
                    html += self.parent.callback.buildCheckBoxTagCallback(instanceID, sectionID, value);
                    self.addCheckBoxCount();
                }, undefined, html);

                let map = {
                    'data-name': this.parent.getDataNames().checkBoxContainer,
                    'data-instance-id': instanceID,
                    'data-section-id': sectionID,
                };
                let model = modelBuilder.selector.getModelWithMap('div', map);
                model.html(html);
                this.parent.listener.checkBoxCheckedListener();
            },
            appendSection: function (instanceID) {
                $(`.${this.parent.getClasses().sectionContainer}[data-instance-id='${instanceID}']`).append(this.buildSection(instanceID));
                this.parent.listener.selectChangeListener();
                this.parent.listener.deleteButtonClickListener();
            },
            removeSelect: function (instanceID, sectionID) {
                let map = {
                    'data-name': this.parent.getDataNames().section,
                    'data-instance-id': instanceID,
                    'data-id': sectionID,
                };
                let model = modelBuilder.selector.getModelWithMap('div', map);
                model.remove();
            },

            getSectionCount: function () {
                return this.data.sectionCount;
            },
            getCheckBoxCount: function () {
                return this.data.checkBoxCount;
            },

            setSectionCount: function (num) {
                return this.data.sectionCount = num;
            },
            setCheckBoxCount: function (num) {
                return this.data.checkBoxCount = num;
            },

            addSectionCount: function () {
                return this.setSectionCount(this.getSectionCount() + 1);
            },
            addCheckBoxCount: function () {
                return this.setCheckBoxCount(this.getCheckBoxCount() + 1);
            },
        },
        listener: {
            parent: undefined,
            init: function (instance) {
                this.parent = instance;
            },
            selectChangeListener: function () {
                let self = this;
                $('.' + this.getParent().getClasses().select).on('change', function () {
                    let selectedOption = $(this).children("option:selected")[0];
                    let data = modelBuilder.attribute.getDataAttribute($(selectedOption), 'data-items');
                    self.parent.builder.appendCheckBoxTag(this, data)
                });
            },
            checkBoxCheckedListener: function () {
                let self = this;
                $('.' + this.getParent().getClasses().checkboxAll).on('click', function () {
                    let containerID = modelBuilder.attribute.getDataAttribute(this, 'data-id');
                    let checkboxes = $(`div[data-name=${self.parent.getDataNames().checkBoxContainer}][data-id="${containerID}"]`).find(':checkbox');
                    checkboxes.prop('checked', this.checked);
                });
            },
            addButtonClickListener: function () {
                let self = this;
                $(`.${this.getParent().getClasses().addButton}`).on('click', function () {
                    let instanceID = modelBuilder.attribute.getDataAttribute(this, 'data-instance-id');
                    self.parent.event.addButtonClickEvent(instanceID);
                });
            },
            deleteButtonClickListener: function () {
                let self = this;
                $(`.${this.getParent().getClasses().deleteButton}`).on('click', function () {
                    let instanceID = modelBuilder.attribute.getDataAttribute(this, 'data-instance-id');
                    let sectionID = modelBuilder.attribute.getDataAttribute(this, 'data-section-id');
                    self.parent.event.deleteButtonClickEvent(instanceID, sectionID);
                });
            },

            getParent: function () {
                return builders.selectWithCheckBox;
            }
        },
        event: {
            parent: undefined,
            init: function (instance) {
                this.parent = instance;
            },
            addButtonClickEvent: function (instanceID) {
                this.parent.builder.appendSection(instanceID);
            },
            deleteButtonClickEvent: function (instanceID, selectID) {
                this.parent.builder.removeSelect(instanceID, selectID);
            },
        },

        getClasses: function () {
            return this.properties.classes;
        },
        getIDs: function () {
            return this.properties.ids;
        },
        getDataNames: function () {
            return this.properties.dataNames;
        },
        getContainerID: function () {
            return this.getIDs().container;
        },
        getJsonData: function () {
            return this.data.json;
        },
        getCount: function () {
            return this.data.count;
        },
        getID: function () {
            return this.data.id;
        },
        getName: function () {
            return this.data.name;
        },
        getFormData: function () {
            return $(`#${this.getIDs().form}`).serialize();
        },

        setJsonData: function (json) {
            return this.data.json = json;
        },
        setCount: function (count) {
            return this.data.count = count;
        },
        setID: function (id) {
            return this.data.id = id;
        },
        setName: function (name) {
            return this.data.name = name;
        },
        setBuildOptionTagCallback: function (callback) {
            this.callback.buildOptionTagCallback = callback;
        },
        setBuildCheckBoxTagCallback: function (callback) {
            this.callback.buildCheckBoxTagCallback = callback;
        },

        addCount: function (num = 1) {
            return this.setCount(this.getCount() + num);
        },
    }
}
export {builders}
