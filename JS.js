var DepartmentList = {};
DepartmentList.init = function () {
    //Фильтр
    var $filter = $('#formFilter');
    var $filterIncludeAll = $filter.find('#Filter_IncludeAll');
    var $filterIncludeExternal = $filter.find('#Filter_IncludeExternal');
    var $depId = $filter.find('#Filter_DepartmentId');
    var $filterShortName = $filter.find('#Filter_ShortName');
    var $filterDepartmentType = $filter.find('#Filter_DepartmentTypeId');
    var $filterClear = $('#FilterClear');
    $filterIncludeAll.prop("checked", false);
    $("#Filter_DepartmentTypeId,#Filter_DepartmentId").customComboBox();
    $filterClear.click(function () {
        $filterIncludeAll.prop("checked", false);
        $filterIncludeExternal.prop("checked", false);
        $filterShortName.val('');
        $filterDepartmentType.data("kendoComboBox").select(0);
        $filterDepartmentType.data("kendoComboBox").value('');
        $depId.data("kendoComboBox").select(0);
        $depId.data("kendoComboBox").value('');
        grid.dataSource.filter([]);
    });

    //Грид
    var grid = $('#deptsGrid').customAjaxGrid({
        saveState: { data: true, scroll: true },
        url: '/Admin/Catalogs/DepartmentListGrid',
        id: 'UniqueId',
        resizable: true,
        name: 'Department',
        showRecordCountInfo: true,
        columns:
        [
            {
                title: '&nbsp;',
                template: '<a href="/Admin/Catalogs/DepartmentEdit/#=UniqueId#" tooltip="Изменить"><span class="fas fa-pencil-alt"></span></a>',
                sortable: false,
                width: 40
            },
            {
                field: 'IsActive', title: 'A',
                headerAttributes: { 'tooltip': 'Признак актуальности', class: 'center' }, attributes: { class: 'center' },
                filterable: false,
                template: '<input type="checkbox" class="k-checkbox active-js" #= IsActive ? "checked" : ""# >',
                width: 40,
                sortable: false
            },
            {
                field: 'UniqueId',
                title: 'Код',
                template: '#=kendo.toString(UniqueId > 1000 ? UniqueId % 1000 : UniqueId, "00")#',
                filterable: false,
                width: 80,
                encoded: false
            },
            {
                field: 'Name',
                title: 'Наименование',
                filterable: false,
                encoded: false
            },
            {
                field: 'Placement', title: 'Р',
                headerAttributes: { 'tooltip': 'Есть размещение', class: 'center' }, attributes: { class: 'center' },
                template: '<input type="checkbox" class="k-checkbox placed-js" #= IsPlaced ? "checked" : ""# >',
                filterable: false,
                width: 40,
                encoded: false
            },
            {
                field: 'ShortName',
                title: 'Краткое наименование',
                filterable: false,
                encoded: false,
                width: 250
            },
            {
                field: 'DepartmentType',
                title: 'Тип подразделения',
                filterable: false,
                encoded: false,
                width: 200,
                locked: false,
                lockable: false
            },
            {
                field: 'OrganizationName',
                title: 'Учреждение',
                filterable: false,
                encoded: false,
                width: 250,
                locked: false,
                lockable: false
            },
            {
                field: 'HeadDepartmentEmployee', title: 'ФИО зав. отделением',
                headerAttributes: { 'tooltip': 'Печатается на этикетке в поле «ФИО врача»<br>и в различных отчётах (накладных, актах)', class: 'center' },
                attributes: { class: 'center' },
                filterable: false,
                width: 200
            }
        ],
        pageSize: 50,
        height: { auto: true },
        dataBound(e) {
            setDisabled(e.sender.table.find('input[type=checkbox]'));
        }
    }).data('kendoGrid');

    function filterGrid() {
        var filter = [];
        var isIncludeAll = $filterIncludeAll.prop("checked");
        var isIncludeExternal = $filterIncludeExternal.prop("checked");
        var shortName = $filterShortName.val();

        var departmentType = $filterDepartmentType.data("kendoComboBox").value();
        var dep = $depId.data("kendoComboBox").value();

        if (isIncludeAll) {
            filter.push({ field: 'IncludeAll', operator: 'eq', value: isIncludeAll });
        }
        if (isIncludeExternal) {
            filter.push({ field: 'IncludeExternal', operator: 'eq', value: isIncludeExternal });
        }
        if (shortName) {
            filter.push({ field: 'ShortName', operator: 'eq', value: shortName });
        }
        if (departmentType.trim()) {
            filter.push({ field: 'DepartmentType', operator: 'eq', value: parseInt(departmentType) });
        }
        if (dep.trim()) {
            filter.push({ field: 'DepartmentId', operator: 'eq', value: parseInt(dep) });
        }
        grid.dataSource.filter(filter);

        return filter;
    }
    $filter.find('input[type=text]').keydown(function (e) { if (e.keyCode == 13) filterGrid(); });
    $('#FilterSearch').click(filterGrid);

    $filter.find("input[type='checkbox'], select").change(filterGrid);

    if (!grid.dataSource.isDataRecovered)
        filterGrid();
};
