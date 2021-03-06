(function (params) {
    var instruments;
    var activeFilterNames = [];
    var searchFiltersByName = {
        's-no-check': function (input, instruments) {
            return instruments.filter((d) => (d['sno'] || '').startsWith(input));
        },
        'serial-no': function (input, instruments) {
            return instruments.filter((d) => (d['serialNo'] || '').startsWith(input));
        },
        'name': function (input, instruments) {
            return instruments.filter((d) => (d['name'] || '').startsWith(input));
        },
        'brand': function (input, instruments) {
            return instruments.filter((d) => (d['brand'] || '').startsWith(input));
        },
        'item-code-checkbox': function (input, instruments) {
            return instruments.filter((d) => (d['itemCode'] || '').startsWith(input));
        },
        'category-checkbox': function (input, instruments) {
            return instruments.filter((d) => (d['category'] || '').startsWith(input));
        }
    };

    $.ajax({
        type : 'GET',
        url : 'lab/names',
        success : function (d) {
            $.each(d, function (i, val) {
                var option = document.createElement('option');
                option.label = val.name;
                option.value = val.id;
                option.text = val.name;
                $('#lab-select').append(option);
            });
            initLabSelect();
            initInventorySelect();
            initializeSearchBox();
            initCheckBoxes();
        },
        error : function (d) {
            window.alert("fetching list of laboratory names failed.")
        }
    });

    function initLabSelect() {
        $('#lab-select').change(function () {
            loadLabInventories(this.value);
        });
    }

    function loadLabInventories(labName) {
        $.ajax({
            type : 'GET',
            url : 'inventory?labName=' + labName,
            success : function (d) {
                $('#inventory-select').empty();
                var option = document.createElement('option');
                option.label = '';
                option.value = 0;
                option.text = '';
                $('#inventory-select').append(option);
                $.each(d, function (i, val) {
                    var option = document.createElement('option');
                    option.label = val.name;
                    option.value = val.id;
                    option.text = val.name;
                    $('#inventory-select').append(option);
                });
            },
            error : function (d) {
                window.alert("fetching list of inventories failed.")
            }
        });
    }

    function initInventorySelect() {
        $('#inventory-select').change(function () {
            getInstruments(this.value);
        });
    }

    function getInstruments(inventoryNo) {
        $.ajax({
            type : 'GET',
            url : 'instruments/list?inventoryNo=' + (inventoryNo || 0),
            success : function (d) {
                instruments = d;
                drawInstruments(d);
            },
            error : function (d) {
                window.alert("fetching list of instruments failed.")
            }
        });
    }

    function drawInstruments(instruments) {
        var dummyRow = $('#dummy-table-row').clone();
        $('#table-content').html('');
        $('#search-results-table').append(dummyRow);
        $.each(instruments, function (i, d) {
            var newRow = $('#dummy-table-row').clone();
            var sNo = newRow.children('#s-no');
            var itemName = newRow.children('#item-name');
            var itemBrand = newRow.children('#item-brand');
            var itemCode = newRow.children('#item-code');
            var category = newRow.children('#item-category');
            var comment = newRow.children('#comment');
            var actions = newRow.children('#actions');
            initializeRowActions(actions, d, i);
            sNo.html(d.sno);
            itemName.html(d.name);
            itemBrand.html(d.brand);
            itemCode.html(d.itemCode);
            category.html(d.category);
            if (d.comments && d.comments.length > 0) {
                comment.html(d.comments[0]);
            }
            sNo.attr('id', 's-no-' + i);
            itemName.attr('id', 'item-name-' + i);
            itemBrand.attr('id', 'item-brand-' + i);
            itemCode.attr('id', 'item-code-' + i);
            category.attr('id', 'category' + i);
            actions.attr('id', 'actions-' + i);
            comment.attr('id', 'comment-' + i);
            newRow.attr('id', 'row-' + i);
            $('#search-results-table').append(newRow);
            newRow.show();
        });

    }

    function initializeRowActions(actionTd, d, i) {
        var actionsDev = actionTd.children('#actions-dev');
        var viewAction = actionsDev.children('#view');
        var deleteAction = actionsDev.children('#delete');
        var reserveAction = actionsDev.children('#reserve');
        var commentAction = actionsDev.children('#comment');
        deleteAction.tooltip();
        reserveAction.tooltip();
        viewAction.tooltip();
        commentAction.tooltip();
        viewAction.on('click', function (event) {
            event.preventDefault();
            drawEquipmentViewDialog(d);
        });
        deleteAction.click(function (event) {
            event.preventDefault();
            drawEquipmentDeleteDialog(d);
        });
        reserveAction.click(function (event) {
            event.preventDefault();
            drawEquipmentReserveDialog(d);
        });
        commentAction.click(function (event) {
            event.preventDefault();
            drawEquipmentCommentDialog(d);
        });
        viewAction.attr('id', 'view-equipment-' + i);
        deleteAction.attr('id', 'delete-equipment-' + i);
        reserveAction.attr('id', 'reserve-equipment-' + i);
        commentAction.attr('id', 'comment-equipment-' + i);
    }

    function drawEquipmentViewDialog(equipment) {
        $('#view-instrument-modal-title').html(equipment.name);
        populateInstrumentViewModalData(equipment);
        $('#dummy-view-instrument-modal').modal({'show' : true});
    }

    function drawEquipmentReserveDialog(equipment) {

    }

    function drawEquipmentDeleteDialog(equipment) {
        $('#delete-equipment-modal-title').html('Delete ' + equipment.name);
        $('#delete-equipment-modal-body').html('Are you sure you want to delete ' + equipment.name + ' ' +
            'instrument from the system?');
        initDeleteInstrumentConfirmButton(equipment);
        $('#dummy-delete-equipment-modal').modal({'show' : true});
    }

    function initDeleteInstrumentConfirmButton(equipment) {
        $('#delete-equipment-confirm').on('click', function (event) {
            $.ajax({
                type : 'DELETE',
                url : 'instruments/delete?instrumentId=' + equipment.id,
                success : function () {
                    drawNotificationDialog({
                        title: equipment.name, message: 'Deleted ' + equipment.name +
                            ' successfully!'
                    });
                },
                error : function () {
                    drawNotificationDialog({
                        title: equipment.name, message: 'Deletion of ' + equipment.name +
                            'failed due to internal error.'
                    });
                }
            });
        });
    }

    function drawNotificationDialog(notifInfo) {
        $('#notification-modal-title').html(notifInfo.title);
        $('#notification-modal-body').html(notifInfo.message);
        $('#dummy-notification-modal').modal({'show' : true});
    }

    function drawEquipmentCommentDialog(equipment) {

    }

    function populateInstrumentViewModalData(equipment) {
        $('#id-view').val(equipment.id);
        $('#s-no-view').val(equipment.sno);
        $('#asset-code-view').val(equipment.assetCode);
        $('#item-code-view').val(equipment.itemCode);
        $('#category-view').val(equipment.category);
        $('#brand-view').val(equipment.brand);
        $('#supplier-view').val(equipment.supplier);
        $('#local-invoice-price-view').val(equipment.localInvoicePrice);
        $('#total-cost-view').val(equipment.totalCost);
        $('#bills-view').val(equipment.bills);
        $('#after-sales-service-view').val(equipment.afterSalesService);
        $('#inventory-type-view').val(equipment.inventoryType);
        $('#inventory-registry-page-view').val(equipment.inventoryRegistryPage);
        $('#inventory-registered-date-view').val(equipment.inventoryRegisteredDate);
        $('#inventory-no-view').val(equipment.inventoryNo);
        $('#serial-no-view').val(equipment.serialNo);
    }

    function initializeSearchBox() {
        $('#search-box').on('keyup', function () {
            var searchTerm = this.value;
            let activeSearchFilters = $.map(activeFilterNames, (elem, index) => searchFiltersByName[elem]);
            var filteredInstruments = $.map(activeSearchFilters, (elem, index) => elem(searchTerm, instruments));
            drawInstruments(filteredInstruments);
        });
    }

    function initCheckBoxes() {
        $('#search-criteria input:checkbox').each((i, checkbox) => $(checkbox).change(function () {
            if (this.checked) {
                activeFilterNames[activeFilterNames.length] = this.attributes['id'].value;
            } else {
                activeFilterNames = activeFilterNames.filter((val, i, arr) => val !== this.attributes['id'].value);
            }
        }));
    }
})();