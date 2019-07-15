let ROWS = '';

let lineNumber = 0;
function row(warehouse) {
    return `<tr role="row" data-rowid="${warehouse._id}">
                <td>${++lineNumber}</td>
                <td>${warehouse._id}</td>
                <td>${warehouse.address}</td> 
                <td>${warehouse.phone}</td> 
                <td>
                    <div class="btn-group">
                        <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Действие
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item editLink" data-id="${warehouse._id}" data-toggle="modal" data-target="#EditModal">Редактировать</a>
                            <a class="dropdown-item removeLink" data-id="${warehouse._id}">Удалить</a>
                        </div>
                    </div>
                </td>
            </tr>`;
}

function reset() {
    let form = document.forms["warehouseAddForm"];
    form.reset();
    $('#warehouseId').removeClass('is-invalid');
    $('#warehousePhone').removeClass('is-invalid');
}

function validatePhoneNumber(input) {
    let regPhoneNumber = /^[(]{1}[0-9]{3}[)]{1} [0-9]{1}[-]{1}[0-9]{3}[-]{1}[0-9]{3}$/;
    if (regPhoneNumber.test($(input).val()) == false) {
        $(input).addClass('is-invalid');
        return false;
    }
    return true;
}

function GetWarehouse(id) {
    $.ajax({
        url: "/api/warehouses/" + id,
        type: "GET",
        contentType: "application/json",
        success: function (warehouse) {
            $("#EditWarehouseId").val(`${warehouse._id}`);
            $("#EditWarehouseAddress").val(`${warehouse.address}`);
            $("#EditWarehousePhone").val(`${warehouse.phone}`);
        }
    });
};

(function GetWarehouses() {
    $.ajax({
        url: "/api/warehouses",
        type: "GET",
        contentType: "application/json",
        success: function (warehouses) {
            let trs = "";
            $.each(warehouses, function (index, warehouse) {
                trs += row(warehouse);
            })

            $("#warehouseDataTable tbody").append(trs);
            ROWS = $("#warehouseDataTable tbody tr");

            $("body").on("click", ".editLink", function () {
                const id = $(this).data("id");
                GetWarehouse(id);
            })

            $("body").on("click", ".removeLink", function () {
                const id = $(this).data("id");
                DeleteWarehouse(id);
            })
        }
    });
})();

function CreateWarehouse(warehouseID, warehouseAddress, warehousePhone) {
    $.ajax({
        url: "/api/warehouses",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            id: warehouseID,
            address: warehouseAddress,
            phone: warehousePhone,
        }),
        success: function (warehouse) {
            if (typeof warehouse == "object") {
                $("#warehouseDataTable tbody").append(row(warehouse));
                reset();
            } else if (typeof warehouse == "string") {
                $('#warehouseId').addClass('is-invalid');
            }
        }
    })
}

function EditWarehouse(warehouseID, warehouseAddress, warehousePhone) {
    $.ajax({
        url: "/api/warehouses",
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id: warehouseID,
            address: warehouseAddress,
            phone: warehousePhone,
        }),
    })
}

function DeleteWarehouse(id) {
    $.ajax({
        url: "/api/warehouses/" + id,
        contentType: "application/json",
        method: "DELETE",
        success: function (warehouse) {
            $(`tr[data-rowid="${warehouse._id}"]`).remove();
        }
    })
}

$('#btnSave').click(() => {
    const id = $('#warehouseId').val();
    const address = $('#warehouseAddress').val();
    const phone = $('#warehousePhone').val();
    if (validatePhoneNumber('#warehousePhone')) {
        CreateWarehouse(id, address, phone);
    }
});

$('#btnEdit').click(() => {
    const id = $('#EditWarehouseId').val();
    const address = $('#EditWarehouseAddress').val();
    const phone = $('#EditWarehousePhone').val();

    if (validatePhoneNumber('#EditWarehousePhone')) {
        EditWarehouse(id, address, phone);
        window.location.reload();
    }
});

$('#countRows').change(() => {
    const count = parseInt($('#countRows').val());
    const trs = ROWS;
    let trsNew = '';

    for (let i = 0; i < count && i < trs.length; i++) {
        trsNew += trs[i].outerHTML;
    }

    $("#warehouseDataTable tbody").html('');
    $("#warehouseDataTable tbody").append(trsNew);
});

$('#inputSearch').on('input', () => {
    let trs = '';

    let value = $('#inputSearch').val();

    for (const row of ROWS) {

        for (let i = 1; i < row.children.length - 1; i++) {
            if (row.children[i].innerHTML.search(value) != -1) {
                trs += row.outerHTML;
                break;
            }
        }
    }

    $("#warehouseDataTable tbody").html('');
    $("#warehouseDataTable tbody").append(trs);
})