namespace DefectTypes {
    let list: List, edit: Edit;

    class List {
        block = $('#List_Block');
        includeAll: JQuery.Checkbox = this.block.find('#Filter_IncludeAll');
        code: JQuery.Textbox = this.block.find('#Filter_Code');
        name: JQuery.Textbox = this.block.find('#Filter_Name');
        baseTypeId;
        grid: kendocustoms.Grid;

        constructor() {
            this.includeAll.change(() => this.filterGrid());
            this.code.add(this.name).keydown(e => { if (e.key == KeyCodes.Enter) this.filterGrid(); });
            this.baseTypeId = this.block.find('#Filter_BaseTypeId').customDropDownList({
                dataTextField: 'Name',
                dataValueField: 'Id',
                change: () => this.filterGrid()
            }).data('kendoDropDownList');

            this.block.find('#FilterSearch').click(() => this.filterGrid());
            this.block.find('#FilterClear').click(() => {
                this.includeAll.prop('checked', false);
                this.code.add(this.code).add(this.name).val('');
                this.baseTypeId.value('');
                this.grid.dataSource.filter({});
            });

            this.grid = this.block.find('#defectsGrid').customAjaxGrid({
                saveState: { columns: true },
                url: '/DefectTypes/ListGrid',
                id: 'UniqueId',
                name: 'ProductDefectType',
                showRecordCountInfo: true,
                columns: [
                        {
                            title: '&nbsp;', field: 'Edit',
                            template: '<span class="fas fa-pencil-alt" tooltip="Редактировать"></span>',
                        width: 40,
                        sortable: false
                    },
                    {
                        field: 'IsActive',
                        title: 'А', headerAttributes: { 'tooltip': 'Признак актуальности', class: 'center' },
                        attributes: { class: 'center' },
                        template: '<input type="checkbox" class="k-checkbox" #= IsActive ? "checked" : ""# >',
                        width: 40
                    },
                    {
                        field: 'Code',
                        title: 'Код',
                        width: 70
                    },
                    {
                        field: 'Name',
                        title: 'Наименование',
                        width: 540
                    },
                    {
                        field: 'ShortName',
                        title: 'Краткое наименование',
                        width: 355
                    },
                    {
                        field: 'BaseType',
                        title: 'Тип брака',
                        width: 180
                    },
                    {
                        field: 'Priority',
                        title: 'Приоритет',
                        width: 130
                    },
                    {
                        field: 'VisibleForFractionation',
                        title: 'Ф', headerAttributes: { 'tooltip': 'Признак доступности при регистрации компонентов фракционирования', class: 'center' },
                        attributes: { class: 'center' },
                        template: '<input type="checkbox" class="k-checkbox" #= VisibleForFractionation ? "checked" : ""# >',
                        width: 40
                    },
                    {
                        field: 'IsManualDefect',
                        title: 'Р', headerAttributes: { 'tooltip': 'Возможность добавить брак вручную', class: 'center' },
                        attributes: { class: 'center' },
                        template: '<input type="checkbox" class="k-checkbox" #= IsManualDefect ? "checked" : ""# >',
                        width: 40
                    },
                    {
                        field: 'IsManualRemoval',
                        title: 'С', headerAttributes: { 'tooltip': 'Возможность снять брак вручную', class: 'center' },
                        attributes: { class: 'center' },
                        template: '<input type="checkbox" class="k-checkbox" #= IsManualRemoval ? "checked" : ""# >',
                        width: 40
                    },
                    {
                        field: 'NoDefectForQuarantine',
                        title: 'К', headerAttributes: { 'tooltip': 'Не влияет на карантин', class: 'center' },
                        attributes: { class: 'center' },
                        template: '<input type="checkbox" class="k-checkbox" #= NoDefectForQuarantine ? "checked" : ""# >',
                        width: 40
                    },
                    {
                        field: 'VisibleForLaboratory',
                        title: 'Л', headerAttributes: { 'tooltip': 'Возможность установки брака в лаборатории', class: 'center' },
                        attributes: { class: 'center' },
                        template: '<input type="checkbox" class="k-checkbox" #= VisibleForLaboratory ? "checked" : ""# >',
                        width: 40
                    }
                ],
                pageSize: 50,
                dataBound(e) {
                    setDisabled(e.sender.table.find("input[type=checkbox]"));
                }
            }).data('kendoGrid');

            this.grid.table.on('click', '.fa-pencil-alt', e => {
                const dataItem = <{ UniqueId: number }><any>this.grid.dataItem(e.target.closest("tr"));
                if (dataItem) {
                    location.hash = String(dataItem.UniqueId);
                }
            });

            if (!this.grid.dataSource.isDataRecovered)
                this.grid.dataSource.read();
        }

        filterGrid() {
            const filter: kendo.data.DataSourceFilter[] = [];
            if (this.includeAll.prop('checked')) {
                filter.push({ field: 'IncludeAll', value: true });
            }
            const code = this.code.val();
            if (code) {
                filter.push({ field: 'Code', value: code });
            }
            const name = this.name.val();
            if (name) {
                filter.push({ field: 'Name', value: name });
            }
            const baseTypeId = this.baseTypeId.value();
            if (baseTypeId)
                filter.push({ field: 'BaseTypeId', value: baseTypeId });

            this.grid.dataSource.filter(filter);
        }
    };

    interface TextValue {
        Text: string;
        Value: string;
    }
    let defaultPriorities: string[];

    class Edit {
        block = $('#Edit_Block');
        title = this.block.find('#Edit_Title');
        IsActive: JQuery.Checkbox = this.block.find('#Edit_IsActive');
        Code: JQuery.Textbox = this.block.find('#Edit_Code');
        Name: JQuery.Textbox = this.block.find('#Edit_Name');
        ShortName: JQuery.Textbox = this.block.find('#Edit_ShortName');
        BaseTypeId: JQuery.Textbox = this.block.find('#Edit_BaseTypeId');
        Priority = this.block.find('#Edit_Priority').customDropDownList({ dataSource: [], dataTextField: '', dataValueField: '', optionLabel: ' ' }).data('kendoDropDownList');
        IsManualDefect: JQuery.Checkbox = this.block.find('#Edit_IsManualDefect');
        NoDefectForQuarantine: JQuery.Checkbox = this.block.find('#Edit_NoDefectForQuarantine');
        VisibleForLaboratory: JQuery.Checkbox = this.block.find('#Edit_VisibleForLaboratory');
        IsManualRemoval: JQuery.Checkbox = this.block.find('#Edit_IsManualRemoval');
        VisibleForFractionation: JQuery.Checkbox = this.block.find('#Edit_VisibleForFractionation');
        AllowSatelliteSeparation: JQuery.Checkbox = this.block.find('#Edit_AllowSatelliteSeparation');
        currentItem!: ViewModel;

        constructor() {
            setDisabled([this.Code, this.Name, this.BaseTypeId]);

            this.IsActive.click(() => this.togglePriority());

            const isManualDefect = this.IsManualDefect,
                isManualRemoval = this.IsManualRemoval;
            isManualDefect.change(function () {
                isManualRemoval.prop('checked', isManualDefect.prop('checked'));
            });

            formatExtensions.restrictInput(this.block);

            this.block.find('#Cancel').click(() => location.hash = '');
            this.block.find('#Save').click(() => this.save());
        }

        fill(model: ViewModel) {
            clearErrors(this.block);
            this.currentItem = model;
            if (!model.IsEtalon)
                setDisabled(this.IsActive);
            this.title.text(model?.EtalonName ? `(${model.EtalonName})` : '');
            this.IsActive.prop('checked', model ? model.IsActive : true);
            this.Code.val(model?.Code || '');
            this.Name.val(model?.Name || '');
            this.ShortName.val(model?.ShortName || '');
            this.BaseTypeId.val(model.BaseType || '');

            const prioritiesSource = [...defaultPriorities];
            if (model.Priority && !(prioritiesSource.some(x => x == model.Priority))) {
                prioritiesSource.push(model.Priority);
                prioritiesSource.sort((a, b) => Number(a) - Number(b));
            }
            this.Priority.dataSource.data(prioritiesSource);
            this.Priority.value(model.Priority ? String(model.Priority) : '');

            this.IsManualDefect.prop('checked', model.IsManualDefect);
            this.NoDefectForQuarantine.prop('checked', model.NoDefectForQuarantine);
            this.VisibleForLaboratory.prop('checked', model.VisibleForLaboratory);
            this.IsManualRemoval.prop('checked', model.IsManualRemoval);
            this.VisibleForFractionation.prop('checked', model.VisibleForFractionation);
            this.AllowSatelliteSeparation.prop('checked', model.AllowSatelliteSeparation);

            this.togglePriority();
        }

        togglePriority() {
            if (this.IsActive.is(':checked')) {
                setDisabled(this.Priority, false);
                this.Priority.value(this.currentItem.Priority);
            } else {
                setDisabled(this.Priority);
                this.Priority.value('');
            }
        }

        save() {
            const model = this.getSaveModel(),
                currentItem = this.currentItem;

            fetch('/DefectTypes/Save', model).then(() => {
                this.updatePriority(model.Priority);
                Object.assign(currentItem, model);
                location.hash = '';
            }).catch((data: { AddCode: string }) => {
                if (data && data.AddCode) {
                    const array: { [index: string]: JQuery | HasWrapperAndInput | HasWrapperAndElement } = {
                        'ShortName': this.ShortName,
                        'Priority': this.Priority
                    };
                    markFieldsAsError(data.AddCode, array);
                }
            });
        }

        getSaveModel() {
            const saveData: SaveModel = {
                UniqueId: this.currentItem.UniqueId,
                ShortName: String(this.ShortName.val()),
                IsActive: this.IsActive.prop('checked'),
                Priority: this.Priority.value(),
                IsManualDefect: this.IsManualDefect.prop('checked'),
                NoDefectForQuarantine: this.NoDefectForQuarantine.prop('checked'),
                VisibleForLaboratory: this.VisibleForLaboratory.prop('checked'),
                IsManualRemoval: this.IsManualRemoval.prop('checked'),
                VisibleForFractionation: this.VisibleForFractionation.prop('checked'),
                AllowSatelliteSeparation: this.AllowSatelliteSeparation.prop('checked'),
            };
            return saveData;
        }

        updatePriority(newPriority: string) {
            const previousPriority = this.currentItem.Priority;
            if (previousPriority != newPriority) {
                if (previousPriority) {
                    defaultPriorities.push(previousPriority);
                    defaultPriorities.sort((a, b) => Number(a) - Number(b));
                }
                if (newPriority) {
                    const index = defaultPriorities.findIndex(x => x == newPriority);
                    if (index > -1) defaultPriorities.splice(index, 1);
                }
            }
        }
    }

    interface SaveModel {
        UniqueId: number;
        IsActive: boolean;
        ShortName: string;
        Priority: string;
        IsManualDefect: boolean;
        NoDefectForQuarantine: boolean;
        VisibleForLaboratory: boolean;
        IsManualRemoval: boolean;
        VisibleForFractionation: boolean;
        AllowSatelliteSeparation: boolean;
    }
    interface ViewModel extends SaveModel {
        IsEtalon: boolean;
        EtalonName: string;
        Code: string;
        Name: string;
        BaseType: string;
        BaseTypeId: string;
    }

    export function init(priorities: string[]) {
        defaultPriorities = priorities;
        window.onhashchange = onHashChange;
        onHashChange();
    }

    function onHashChange(ev?: Event) {
        const hash = location.hash.replace('#', '');
        if (hash) {
            fetch('/DefectTypes/Get', { id: hash }).then((data: ViewModel) => {
                if (!edit)
                    edit = new Edit();
                edit.fill(data);
                edit.block.show();
                list?.block.hide();
                document.title = 'Брак продукции';
            }).catch(() => location.hash = '');
        } else {
            if (edit && hasChanges(edit.currentItem, edit.getSaveModel())) {
                history.pushState({}, document.title, (ev as HashChangeEvent).oldURL);
                confirm('Есть несохранённые изменения. Продолжить?', yes => {
                    if (yes) {
                        history.replaceState({}, document.title, (ev as HashChangeEvent).newURL);
                        switchToList();
                    }
                })
            } else switchToList();
        }

        function switchToList() {
            if (!list)
                list = new List();
            list.block.show();
            list.grid.dataSource.read();
            edit?.block.hide();
            document.title = 'Браки продукции';
        }
    }
};
