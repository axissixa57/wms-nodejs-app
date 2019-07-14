let ROWS = '';

const btnPrintOrder = document.getElementById('print-order-list');
btnPrintOrder.addEventListener('click', () => {
    btnPrintOrder.style.display = 'none';
    window.open('../templates/shipments/shipment.html');
    setTimeout(() => {
        btnPrintOrder.style.display = 'block';
    }, 0);
});

function row(shipment) {
    const dateFromDb = new Date(shipment.shipment_date);
    const day = dateFromDb.getDate() > 9 ? dateFromDb.getDate() : `0${dateFromDb.getDate()}`;
    const month = dateFromDb.getMonth() > 9 ? dateFromDb.getMonth() + 1 : `0${dateFromDb.getMonth() + 1}`;
    const date = `${day}.${month}.${dateFromDb.getFullYear()}`;
    let bgColor = '';

    if (shipment.status == 'К выполнению') {
        bgColor = 'blue-bg';
    } else if (shipment.status == 'Собирается') {
        bgColor = 'red-bg';
    } else if (shipment.status == 'Собрана') {
        bgColor = 'orange-bg';
    } else if (shipment.status == 'Проверена') {
        bgColor = 'yellow-bg';
    }

    if (shipment.status != 'Отгружена') {
        return `<tr class=${bgColor} data-rowid="${shipment._id}">
                <td>${date}</td>
                <td>${shipment.id_warehouse}</td> 
                <td>${shipment.id_consignee}</td> 
                <td>${shipment._id}</td> 
                <td>${shipment.status}</td> 
                <td>${shipment.pallet}</td> 
                <td>${shipment.total_weight}</td>
                <td>
                    <div class="btn-group">
                        <button type="button" class="btn btn-dark dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Действие
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item btnPick" href="#" data-toggle="modal" data-target=".bd-example-modal-xl">Открыть</a>
                            <a class="dropdown-item removeLink" href="#" data-id="${shipment._id}">Удалить</a>
                        </div>
                    </div>
                </td>
            </tr>`;
    }
}

let lineNumber = 0;
function rowForShipmentDataTable(product, shipment, warehouse) {
    let quantity = 0;
    let storage_location;
    let remainder;

    for (let i = 0; i < shipment.products.length; i++) {
        if (shipment.products[i].id == product._id) {
            quantity = shipment.products[i].quantity;
        }
    }

    for (let i = 0; i < warehouse.products.length; i++) {
        if (warehouse.products[i].id_product == product._id) {
            storage_location = warehouse.products[i].storage_location;
            remainder = warehouse.products[i].quantity;
            break;
        }
    }

    return `<tr role="row">
                <td>${++lineNumber}</td>
                <td>${product._id}</td>
                <td>${product.category}</td>
                <td>${product.name}</td>
                <td>${storage_location}</td>
                <td>${shipment.id_warehouse}</td>
                <td>${quantity}</td>
                <td>${remainder}</td>
            </tr>`;
}

function markShipmentsAndSelectShipment() {
    const rowsMainDataTable = document.querySelectorAll('.mainDataTable tbody tr');
    for (const row of rowsMainDataTable) {

        row.addEventListener('click', (e) => {
            if (e.ctrlKey) {
                if (row.classList.contains('green-bg')) {
                    row.classList.remove('green-bg');
                } else {
                    row.classList.add('green-bg');
                }
            }
        })
    }

    const btnPicks = document.querySelectorAll('.btnPick');
    for (const btnPick of btnPicks) {

        btnPick.addEventListener('click', (e) => {
            const shipmentDataTable = document.querySelector('#shipmentDataTable tbody').innerHTML = '';
            const id_shipment = btnPick.parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML;
            lineNumber = '';
            GetShipment(id_shipment);
        });
    }
}

(function GetShipments() {
    $.ajax({
        url: "http://localhost:3000/api/shipments",
        type: "GET",
        contentType: "application/json",
        success: function(shipments) {
            let rows = "";
            $.each(shipments, function(index, shipment) {
                rows += row(shipment);
            });

            $(".mainDataTable tbody").append(rows);
            ROWS = $(".mainDataTable tbody tr");

            markShipmentsAndSelectShipment();

            $("body").on("click", ".removeLink", function() {
                const id = $(this).data("id");
                DeleteShipment(id);
            })
        }
    });
})();

function shipmentTitle(shipment, consignee) {
    $(".shipment_title").html('');
    const dateFromDb = new Date(shipment.shipment_date);
    const day = dateFromDb.getDate() > 9 ? dateFromDb.getDate() : `0${dateFromDb.getDate()}`;
    const month = dateFromDb.getMonth() > 9 ? dateFromDb.getMonth() : `0${dateFromDb.getMonth()}`;
    const date = `${day}.${month}.${dateFromDb.getFullYear()}`;
    const time = new Date();
    const dayNow = time.getDate() > 9 ? time.getDate() : `0${time.getDate()}`;
    const monthNow = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : `0${time.getMonth() + 1}`;
    const yearNow = time.getFullYear();
    const hourNow = time.getHours() > 9 ? time.getHours() : `0${time.getHours()}`;
    const minutesNow = time.getMinutes() > 9 ? time.getMinutes() : `0${time.getMinutes()}`;
    const secondsNow = time.getSeconds() > 9 ? time.getSeconds() : `0${time.getSeconds()}`;

    return `<p class="h2 p-1">Сборочный лист № <i id="shipmentId">${shipment._id}</i> от ${date}</p>
            <p class="h6 pt-2">Дата и время: ${dayNow}.${monthNow}.${yearNow} ${hourNow}:${minutesNow}:${secondsNow}</p>
            <p class="h6 pt-1">Грузополучатель: ${shipment.id_consignee}</p>
            <p class="h6 pt-1">Адрес грузополучателя: ${consignee.address}</p>
            <div class="d-flex col-md-4 p-0 pt-1 status">
                <p class="h6 pt-2 pr-1">Статус:</p>
                <div class="pl-1 pr-1">
                    <select class="status custom-select" id="status" name="status" >
                        <option selected>К выполнению</option>
                        <option>Собирается</option>
                        <option>Собрана</option>
                        <option>Проверена</option>
                    </select>
                </div>
                <button id="btnSave" type="button" class="btn btn-primary" onclick="getId()">Сохранить</button>
            </div>`;
}

function getId() {
    const id = parseInt($('#shipmentId').html());
    const status = $('#status').val();

    console.log({ id, status })
    ChangeStatus(id, status);
    window.location.reload();
}

async function GetConsignee(id) {
    const response = await fetch(`http://localhost:3000/api/consignees/${id}`);
    const consignee = await response.json();
    return consignee;
}

async function GetWarehouse(id) {
    const response = await fetch(`http://localhost:3000/api/warehouses/${id}`);
    const warehouse = await response.json();
    return warehouse;
}

function GetShipmentProducts(id, shipment) {
    $.ajax({
        url: `http://localhost:3000/api/shipment/${id}/products`,
        type: "GET",
        contentType: "application/json",
        success: async function(products) {
            const warehouse = await GetWarehouse(shipment.id_warehouse);
            const consignee = await GetConsignee(shipment.id_consignee);
            let rows = '';
            const ps = shipmentTitle(shipment, consignee);

            $.each(products, function(index, product) {
                rows += rowForShipmentDataTable(product, shipment, warehouse);
            });

            $(".shipment_title").append(ps);
            $("#shipmentDataTable tbody").append(rows);
        }
    });
}

function GetShipment(id) {
    $.ajax({
        url: "http://localhost:3000/api/shipments/" + id,
        type: "GET",
        contentType: "application/json",
        success: function(shipment) {
            GetShipmentProducts(shipment._id, shipment);
        }
    });
}

$('#btnSelected').click(() => {
    $('#code_car').html(`${Math.floor(new Date().getTime() / 100 - 15500000000)}`);
})

function UpdateShipmentStatus(shipmentIds, status) {
    $.ajax({
        url: "http://localhost:3000/api/shipments",
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            ids: shipmentIds,
            status: status
        }),
    });
}

$('#btnCreate').click(() => {
    const rowsMainDataTable = document.querySelectorAll('.mainDataTable tbody tr');
    let ids_shipment = [];
    const status = 'Отгружена';
    for (const row of rowsMainDataTable) {
        if (row.classList.contains('green-bg')) {
            ids_shipment.push(parseInt(row.children[3].innerHTML));
        }
    }

    if (ids_shipment.length == 0) {
        alert('Выберите определённые сборки с помощью Ctrl + ЛКМ');
    } else {
        UpdateShipmentStatus(ids_shipment, status);
        const codeCar = $('#code_car').html();
        CreateShipmentToTTN(codeCar, ids_shipment);
        window.location.reload();
    }
})

function CreateShipmentToTTN(id, shipment_ids) {
    $.ajax({
        url: "http://localhost:3000/api/shipmentstottn",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            id: id,
            shipments: shipment_ids,
        }),
        success: function(result) {
            console.log(result);
        },
    })
}

function ChangeStatus(id, status) {
    $.ajax({
        url: "http://localhost:3000/api/shipment",
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id: id,
            status: status
        }),
    });
}

function DeleteShipment(id) {
    $.ajax({
        url: "http://localhost:3000/api/shipments/" + id,
        contentType: "application/json",
        method: "DELETE",
        success: function(shipment) {
            $(`tr[data-rowid="${shipment._id}"]`).remove();
        }
    })
}

$('#from').on('input', () => {
    let trs = '';

    let value = $('#from').val();

    for (const row of ROWS) {
        if (row.children[1].innerHTML.search(value) != -1) {
            trs += row.outerHTML;
        }
    }

    $(".mainDataTable tbody").html('');
    $(".mainDataTable tbody").append(trs);
    markShipmentsAndSelectShipment();
})

$('#to').on('input', () => {
    let trs = '';

    let value = $('#to').val();

    for (const row of ROWS) {
        if (row.children[2].innerHTML.search(value) != -1) {
            trs += row.outerHTML;
        }
    }

    $(".mainDataTable tbody").html('');
    $(".mainDataTable tbody").append(trs);
    markShipmentsAndSelectShipment();
})

function toDateMillisec(dateString) {
    const splitDate = dateString.split('.');
    return Date.parse(new Date(splitDate[2], splitDate[1] - 1, splitDate[0]));
}

$('#btnSearch').on('click', () => {
    let trs = '';
    const startDate = $('#startDate').val();
    const finishDate = $('#finishDate').val();
    const from = startDate == '' ? Date.parse('01 Jan 1970 00:00:00 GMT') : toDateMillisec(startDate);
    const to = finishDate == '' ? Date.parse(new Date()) : toDateMillisec(finishDate);

    for (const row of ROWS) {

        if (from <= toDateMillisec(row.children[0].innerHTML) && to >= toDateMillisec(row.children[0].innerHTML)) {
            trs += row.outerHTML;
        }
    }

    $(".mainDataTable tbody").html('');
    $(".mainDataTable tbody").append(trs);
    markShipmentsAndSelectShipment();
})

$('#btnShippingList').on('click', () => {
    const rowsMainDataTable = document.querySelectorAll('.mainDataTable tbody tr');
    let req = '';

    for (const row of rowsMainDataTable) {
        if (row.classList.contains('green-bg')) {
            req += `id=${row.children[3].innerHTML}&`
        }
    }

    if (req != '') {
        window.open('http://localhost:3000/template/shipments?' + req);
    } else {
        alert('Выберите определённые сборки с помощью Ctrl + ЛКМ');
    }
})