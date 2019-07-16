function countCost(input) {
    let cost = 0;

    const price = parseFloat(input.parentNode.parentNode.parentNode.children[5].innerHTML);
    const quantity = parseInt(input.value);

    if (typeof quantity == "number" && quantity > 0) {
        cost = price * quantity;
    }

    input.parentNode.parentNode.parentNode.children[6].innerHTML = cost.toFixed(2);
}

function row(product) {
    let quantity = 0;
    if (product.quantityFromShipment != undefined) {
        quantity = product.quantityFromShipment;
    } else if (product.quantity != undefined) {
        quantity = product.quantity;
    }

    return `<tr onclick="markRow(this)">
                <td>${product._id}</td>
                <td>${product.name}</td> 
                <td>${product.unit}</td> 
                <td>${product.weight}</td>
                <td onclick="markInputQuantity(this)">
                    <div class="col">
                        <input type="number" class="form-control form-control-lg" id="quantity" name="quantity" data-quantity="${quantity}" value="${quantity}" oninput="countCost(this)">
                    </div>
                </td>
                <td>${product.cost}</td> 
                <td>
                    ${(parseFloat(product.cost) * parseInt(quantity)).toFixed(2)}
                </td> 
                <td>
                    ${toKg(product.weight, product.unit)}
                </td>
            </tr>`;
}

function hideModalScrollable(someModalScrollable) {
    someModalScrollable.removeAttribute('aria-modal');
    someModalScrollable.setAttribute('aria-hidden', 'true');
    someModalScrollable.classList.remove('show');
    someModalScrollable.style.display = 'none';
    document.body.removeAttribute('class');
    document.body.removeChild(document.body.lastElementChild);
}

function toColorizeSelectedPositionAndChooseValue(optionsAll, inputResult, btnChoose, someModalScrollable) {
    for (let i = 0; i < optionsAll.length; i++) {
        optionsAll[i].addEventListener('click', () => {
            for (let j = 0; j < optionsAll.length; j++) {
                if (optionsAll[j].classList.contains('selected')) {
                    optionsAll[j].classList.remove('selected');
                }
            }

            optionsAll[i].classList.add('selected');
        });

        optionsAll[i].addEventListener('dblclick', () => {
            inputResult.value = optionsAll[i].children[1].innerHTML;
            hideModalScrollable(someModalScrollable);
        });
    }

    btnChoose.addEventListener('click', () => {
        for (let i = 0; i < optionsAll.length; i++) {
            if (optionsAll[i].classList.contains('selected')) {
                inputResult.value = optionsAll[i].children[1].innerHTML;
                hideModalScrollable(someModalScrollable);
            }
        }
    });
}

function rowForReference(obj) {
    return `<tr role="row">
            <td>${obj._id}</td>
            <td style="text-align: left;">${obj.address}</td>
        </tr>`;
}

function add1000ToConsignee() {
    if ($("#add1000").attr("checked") == 'checked') {

    }
}

function rowForProductCategoryTable(product) {
    return `<tr role="row">
            <td>${product.name}</td>
            <td style="text-align: right;">${product._id}</td> 
        </tr>`;
}

function markRow(tr) {
    if (tr.classList.contains('marked')) {
        tr.classList.remove('marked');
    } else {
        tr.classList.add('marked');
    }
}

function markInputQuantity(td) {
    const tr = td.parentNode;
    markRow(tr);
}

function toKg(quantity, unit, goodName) {
    if (unit == "шт") { // && goodName == "Салфетка.."
        return quantity * 1 / 1000;
    } else if (unit == "л") {
        return quantity;
    } else if (unit == "мл") {
        return quantity / 1000;
    } else if (unit == "г") {
        return quantity / 1000;
    } else {
        return quantity;
    }
}

function countTotalWeight() {
    let totalWeight = 0;
    const trsMainTable = document.querySelectorAll('#productsDataTable tbody tr');

    for (let i = 0; i < trsMainTable.length; i++) {
        totalWeight += parseFloat(trsMainTable[i].children[7].innerHTML) * parseInt(trsMainTable[i].children[4].children[0].children[0].value);
    }
    return totalWeight.toFixed(2);
}

function countTotalCost() {
    let totalCost = 0;
    const trsMainTable = document.querySelectorAll('#productsDataTable tbody tr');

    for (let i = 0; i < trsMainTable.length; i++) {
        totalCost += parseFloat(trsMainTable[i].children[6].innerHTML);
    }
    return totalCost.toFixed(2);
}

$('#btnWMS').click(() => {
    const codeCar = $('#codeCar').val();
    $("#productsDataTable tbody").html('');
    GetProducts(codeCar);
});

$('#btnCreateDoc').click(async () => {
    const docId = $('#id_ttn').val();
    const docDate = $('#date_ttn').val();
    const docWarehouseId = $('#id_warehouse').val();
    const docIdConsignee = $('#id_consignee').val();
    const docComment = $('#comment').val();
    const docCarTripTicketId = $('#tripTicket').val();
    const docCarOrganization = $('#organization').val();
    const docCarBrand = $('#brand').val();
    const docCarStateNumber = $('#stateNumber').val();
    const docCarDriverName = $('#driverName').val();
    const docCarDriverId = $('#driverId').val();
    const docTotalWeight = countTotalWeight();
    const docTotalCost = countTotalCost();
    const docStatus = $('#btnEnter').hasClass('btn-success') ? 'Заблокирован' : 'Разблокирован';
    const codeCar = $('#codeCar').val();

    const trsProductsTable = document.querySelectorAll('#productsDataTable tbody tr');
    const docProducts = [];

    for (let i = 0; i < trsProductsTable.length; i++) {
        docProducts[i] = {
            id: trsProductsTable[i].children[0].innerHTML,
            quantity: trsProductsTable[i].children[4].children[0].children[0].value
        };

        trsProductsTable[i].children[4].children[0].children[0].setAttribute('data-quantity', trsProductsTable[i].children[4].children[0].children[0].value)
    }

    if (docWarehouseId.length > 0 && docProducts.length > 0) {
        const isThereWarehouse = await fetch('/api/warehouses/' + docWarehouseId).then(res => res.json()).catch(err => 'No');

        const areThereProductsInWarehouse = await CheckProducts(docWarehouseId, docProducts);

        if (areThereProductsInWarehouse.message == 'Success') {
            CreateTTN(docId, docDate, docWarehouseId, docIdConsignee,
                docComment, docCarTripTicketId, docCarOrganization, docCarBrand,
                docCarStateNumber, docCarDriverName, docCarDriverId, docProducts,
                codeCar, docTotalWeight, docTotalCost, docStatus);

            MinusProductQuantityOfWarehouse(docWarehouseId, docProducts);
        } else {
            alert(areThereProductsInWarehouse.message);
        }
    } else {
        alert('Введите номер склада и выберите как минимум один товар.')
    }
})

$('.btnDelete').on('click', () => {
    const trsMainTable = document.querySelectorAll('#productsDataTable tr');
    for (let i = 0; i < trsMainTable.length; i++) {
        const tBody = trsMainTable[i].parentNode;

        if (trsMainTable[i].classList.contains('marked')) {
            tBody.removeChild(trsMainTable[i]);
        }
    }
});

$('#btnEnter').click(() => {
    $('#btnEnter').toggleClass('btn-success');
    $('#btnEnter').toggleClass('btn-danger');

    if ($('#btnEnter').hasClass('btn-success')) {
        $('input').each((index, inp) => {
            $(inp).attr('disabled', 'disabled');
        });

        $('#btnAdd').attr('disabled', 'disabled');
        $('#btnRemove').attr('disabled', 'disabled');
        $('#btnCar').attr('disabled', 'disabled');
        $('#btnWMS').attr('disabled', 'disabled');
    } else {
        $('input').each((index, inp) => {
            $(inp).removeAttr('disabled', 'disabled');
        });

        $('#btnAdd').removeAttr('disabled', 'disabled');
        $('#btnRemove').removeAttr('disabled', 'disabled');
        $('#btnCar').removeAttr('disabled', 'disabled');
        $('#btnWMS').removeAttr('disabled', 'disabled');
    }

    const docId = $('#id_ttn').val();
    const docDate = $('#date_ttn').val();
    const docIdWarehouse = $('#id_warehouse').val();
    const docIdConsignee = $('#id_consignee').val();
    const docComment = $('#comment').val();
    const docCarTripTicketId = $('#tripTicket').val();
    const docCarOrganization = $('#organization').val();
    const docCarBrand = $('#brand').val();
    const docCarStateNumber = $('#stateNumber').val();
    const docCarDriverName = $('#driverName').val();
    const docCarDriverId = $('#driverId').val();

    const trsProductsTable = document.querySelectorAll('#productsDataTable tbody tr');
    const docProducts = [];
    const warehouseProducts = [];

    for (let i = 0; i < trsProductsTable.length; i++) {
        docProducts[i] = {
            id: trsProductsTable[i].children[0].innerHTML,
            quantity: trsProductsTable[i].children[4].children[0].children[0].value
        };

        warehouseProducts[i] = {
            id: trsProductsTable[i].children[0].innerHTML,
            quantity: parseInt(trsProductsTable[i].children[4].children[0].children[0].getAttribute('data-quantity')) - parseInt(trsProductsTable[i].children[4].children[0].children[0].value)
        };

        trsProductsTable[i].children[4].children[0].children[0].setAttribute('data-quantity', trsProductsTable[i].children[4].children[0].children[0].value)
    }

    const docTotalWeight = countTotalWeight();
    const docTotalCost = countTotalCost();
    const docStatus = $('#btnEnter').hasClass('btn-success') ? 'Заблокирован' : 'Разблокирован';
    const codeCar = $('#codeCar').val();

    let id = 0;
    if (document.forms["ttnForm"].elements["id"].value == 0) {
        id = $('input[name=id]').attr('data-id');
    } else {
        id = document.forms["ttnForm"].elements["id"].value;
    }

    if (id != 0) {
        EditTTN(id, docId, docDate, docIdWarehouse, docIdConsignee,
            docComment, docCarTripTicketId, docCarOrganization, docCarBrand,
            docCarStateNumber, docCarDriverName, docCarDriverId, docProducts,
            codeCar, docTotalWeight, docTotalCost, docStatus);

        EditProductQuantityOfWarehouse(docIdWarehouse, warehouseProducts);
    }
});

$('#btnPrint').click(() => {
    const id = $('input[name=id]').attr('data-id') || $('input[name=id]').val();
    if (id == '0') return alert('Сначала создайте документ.');
    window.open('/templates/ttn/' + id);
});

$('#btnCar').on('click', () => {
    GetLastTTN();
});

$("#add1000").on('change', () => {
    if ($('#add1000').prop('checked')) {
        $('#id_consignee').val(`1000${$('#id_consignee').val()}`);
    }
});

(function GetTTN(id) {
    if (id != '') {
        $.ajax({
            url: "/api/ttn/" + id,
            type: "GET",
            contentType: "application/json",
            success: function (ttn) {
                $('#btnCreateDoc').attr('disabled', 'disabled');
                let rows = "";

                const products = ttn.products;
                const quantityProducts = ttn.quantityProducts;

                for (let i = 0; i < products.length; i++) {
                    if (products[i]._id in quantityProducts) {
                        products[i].quantity = quantityProducts[products[i]._id];
                    }
                }

                $.each(products, function (index, product) {
                    rows += row(product);
                });

                $("#productsDataTable tbody").append(rows);
                if (ttn.doc.status == 'Заблокирован') {
                    $('#btnEnter').removeClass('btn-danger');
                    $('#btnEnter').addClass('btn-success');

                    $('input').each((index, inp) => {
                        $(inp).attr('disabled', 'disabled');
                    });

                    $('#btnAdd').attr('disabled', 'disabled');
                    $('#btnRemove').attr('disabled', 'disabled');
                    $('#btnCar').attr('disabled', 'disabled');
                    $('#btnWMS').attr('disabled', 'disabled');
                } else if (ttn.doc.status == 'Разблокирован') {
                    $('#btnEnter').removeClass('btn-success');
                    $('#btnEnter').addClass('btn-danger');

                    $('input').each((index, inp) => {
                        $(inp).removeAttr('disabled', 'disabled');
                    });

                    $('#btnAdd').removeAttr('disabled', 'disabled');
                    $('#btnRemove').removeAttr('disabled', 'disabled');
                    $('#btnCar').removeAttr('disabled', 'disabled');
                    $('#btnWMS').removeAttr('disabled', 'disabled');
                }

                $('#id_ttn').val(`${ttn.doc.id_doc}`);
                $('#date_ttn').val(`${ttn.doc.date}`);
                $('#id_warehouse').val(`${ttn.doc.id_warehouse}`);
                $('#id_consignee').val(`${ttn.doc.id_consignee}`);
                $('#comment').val(`${ttn.doc.comment}`);
                $('#tripTicket').val(`${ttn.doc.car.id_tripTicket}`);
                $('#organization').val(`${ttn.doc.car.organization}`);
                $('#brand').val(`${ttn.doc.car.brand}`);
                $('#stateNumber').val(`${ttn.doc.car.stateNumber}`);
                $('#driverName').val(`${ttn.doc.car.driver}`);
                $('#driverId').val(`${ttn.doc.car.id_driver}`);

                GetWarehouse(ttn.doc.id_warehouse);
                if (parseInt(ttn.doc.id_consignee) > 10000) {
                    let id = `${ttn.doc.id_consignee}`.slice(4);
                    GetConsignee(id);
                } else {
                    GetConsignee(ttn.doc.id_consignee);
                }

                GetWarehouses();
                GetConsignees();
                GetCosmeticProducts();
                GetMeatProducts();
                GetMarineProducts();
            }
        });
    } else {
        GetWarehouses();
        GetConsignees();
        GetCosmeticProducts();
        GetMeatProducts();
        GetMarineProducts();
    }
})($('input[name=id]').attr('data-id'));

function CreateTTN(docId, docDate, docIdWarehouse, docIdConsignee, docComment,
    docCarTripTicketId, docCarOrganization, docCarBrand, docCarStateNumber,
    docCarDriverName, docCarDriverId, docProducts, docCodeCar, docTotalWeight, docTotalCost, docStatus) {
    $.ajax({
        url: "/api/ttn",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            ttnId: docId,
            ttnDate: docDate,
            ttnWarehouseId: docIdWarehouse,
            ttnConsigneeId: docIdConsignee,
            ttnComment: docComment,
            ttnCarTripTicketId: docCarTripTicketId,
            ttnCarOrganization: docCarOrganization,
            ttnCarBrand: docCarBrand,
            ttnCarStateNumber: docCarStateNumber,
            ttnCarDriverName: docCarDriverName,
            ttnCarDriverId: docCarDriverId,
            ttnProducts: docProducts,
            ttnCodeCar: docCodeCar,
            ttnTotalWeight: docTotalWeight,
            ttnTotalCost: docTotalCost,
            ttnStatus: docStatus
        }),
        success: function (ttn) {
            const form = document.forms["ttnForm"];
            form.elements["id"].value = ttn._id;
            $('#btnCreateDoc').attr('disabled', 'disabled');
        }
    });
}

function EditTTN(id, docId, docDate, docIdWarehouse, docIdConsignee, docComment,
    docCarTripTicketId, docCarOrganization, docCarBrand, docCarStateNumber,
    docCarDriverName, docCarDriverId, docProducts, docCodeCar, docTotalWeight, docTotalCost, docStatus) {
    $.ajax({
        url: "/api/ttn",
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id: id,
            ttnId: docId,
            ttnDate: docDate,
            ttnWarehouseId: docIdWarehouse,
            ttnConsigneeId: docIdConsignee,
            ttnComment: docComment,
            ttnCarTripTicketId: docCarTripTicketId,
            ttnCarOrganization: docCarOrganization,
            ttnCarBrand: docCarBrand,
            ttnCarStateNumber: docCarStateNumber,
            ttnCarDriverName: docCarDriverName,
            ttnCarDriverId: docCarDriverId,
            ttnProducts: docProducts,
            ttnCodeCar: docCodeCar,
            ttnTotalWeight: docTotalWeight,
            ttnTotalCost: docTotalCost,
            ttnStatus: docStatus
        })
    })
}

async function CheckProducts(docWarehouseId, docProducts) {
    let params = `idWarehouse=${docWarehouseId}&`;

    docProducts.map(product => params += `idProduct=${product.id}&`)

    const response = await fetch(`/api/warehouses/products?${params}`);
    const json = await response.json();
    return json;
}

function GetProducts(codeCar) {
    $.ajax({
        url: `/api/shipments/codecar/${codeCar}`,
        type: "GET",
        contentType: "application/json",
        success: function (object) {
            if (typeof object != 'string') {
                let rows = "";

                const products = object.products;
                const quntityProducts = object.quantityProducts;

                for (let i = 0; i < products.length; i++) {
                    if (products[i]._id in quntityProducts) {
                        products[i].quantityFromShipment = quntityProducts[products[i]._id];
                    }
                }

                $.each(products, function (index, product) {
                    rows += row(product);
                });

                $("#productsDataTable tbody").append(rows);
            }
        }
    });
}

function GetWarehouses() {
    $.ajax({
        url: "/api/warehouses",
        type: "GET",
        contentType: "application/json",
        success: function (warehouses) {
            let tds = "";
            $.each(warehouses, function (index, warehouse) {
                tds += rowForReference(warehouse);
            })
            $("#all_counterAgents tbody").append(tds);

            const warehousesALL = document.querySelectorAll('#all_counterAgents tbody tr');
            const warehouseID = document.getElementById('warehouse_address');
            const btnWarehouses = document.getElementById('btnWarehouses');
            const counterAgentModalScrollable = document.getElementById('counterAgentModalScrollable');

            toColorizeSelectedPositionAndChooseValue(warehousesALL, warehouseID, btnWarehouses, counterAgentModalScrollable);
        }
    });
};

function GetConsignees() {
    $.ajax({
        url: "/api/consignees",
        type: "GET",
        contentType: "application/json",
        success: function (consignees) {
            let tds = "";
            $.each(consignees, function (index, consignee) {
                tds += rowForReference(consignee);
            })
            $("#all_consignees tbody").append(tds);

            const consigneesALL = document.querySelectorAll('#all_consignees tbody tr');
            const consigneeID = document.getElementById('consignee_address');
            const btnConsignees = document.getElementById('btnConsignees');
            const customerModalScrollable = document.getElementById('customerModalScrollable');

            toColorizeSelectedPositionAndChooseValue(consigneesALL, consigneeID, btnConsignees, customerModalScrollable);
        }
    });
};

function GetProduct(id) {
    $.ajax({
        url: "/api/products/" + id,
        type: "GET",
        contentType: "application/json",
        success: function (product) {
            $("#productsDataTable tbody").append(row(product));
        }
    });
}

function GetCosmeticProducts() {
    $.ajax({
        url: "/api/products/cosmetics",
        type: "GET",
        contentType: "application/json",
        success: function (products) {
            let trs = "";
            $.each(products, function (index, product) {
                trs += rowForProductCategoryTable(product);
            })

            $("#cosmeticsDataTable tbody").append(trs);

            const cosmeticsDataTableTrs = document.querySelectorAll('#cosmeticsDataTable tr');

            for (let i = 0; i < cosmeticsDataTableTrs.length; i++) {
                cosmeticsDataTableTrs[i].addEventListener('click', () => {
                    const code = parseInt(cosmeticsDataTableTrs[i].children[1].innerHTML);
                    GetProduct(code);
                });
            }
        }
    });
};

function GetMeatProducts() {
    $.ajax({
        url: "/api/products/meat",
        type: "GET",
        contentType: "application/json",
        success: function (products) {
            let trs = "";
            $.each(products, function (index, product) {
                trs += rowForProductCategoryTable(product);
            })
            $("#meatDataTable tbody").append(trs);

            const meatDataTablebleTrs = document.querySelectorAll('#meatDataTable tr');

            for (let i = 0; i < meatDataTablebleTrs.length; i++) {
                meatDataTablebleTrs[i].addEventListener('click', () => {
                    const code = parseInt(meatDataTablebleTrs[i].children[1].innerHTML);
                    GetProduct(code);
                });
            }
        }
    });
};

function GetMarineProducts() {
    $.ajax({
        url: "/api/products/marine",
        type: "GET",
        contentType: "application/json",
        success: function (products) {
            let trs = "";
            $.each(products, function (index, product) {
                trs += rowForProductCategoryTable(product);
            })
            $("#marineDataTable tbody").append(trs);

            const marineDataTablebleTrs = document.querySelectorAll('#marineDataTable tr');

            for (let i = 0; i < marineDataTablebleTrs.length; i++) {
                marineDataTablebleTrs[i].addEventListener('click', () => {
                    const code = parseInt(marineDataTablebleTrs[i].children[1].innerHTML);
                    GetProduct(code);
                });
            }
        }
    });
};

function GetWarehouse(id) {
    $.ajax({
        url: "/api/warehouses/" + id,
        type: "GET",
        contentType: "application/json",
        success: function (warehouse) {
            $('#warehouse_address').val(`${warehouse.address}`);
        }
    });
}

function GetConsignee(id) {
    $.ajax({
        url: "/api/consignees/" + id,
        type: "GET",
        contentType: "application/json",
        success: function (consignee) {
            $('#consignee_address').val(`${consignee.address}`);
        }
    });
}

function MinusProductQuantityOfWarehouse(docWarehouseId, docProducts) {
    $.ajax({
        url: "/api/warehouse/quantity",
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id_warehouse: docWarehouseId,
            products: docProducts,
        }),
        success: function (string) {
            if (string != 'Успех') {
                alert(string);
            }
        }
    })
}

function EditProductQuantityOfWarehouse(docWarehouseId, docProducts) {
    $.ajax({
        url: "/api/warehouse/editquantity",
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id_warehouse: docWarehouseId,
            products: docProducts,
        })
    })
}

function GetLastTTN() {
    $.ajax({
        url: "/api/ttns/last",
        type: "GET",
        contentType: "application/json",
        success: function (ttn) {
            console.log(ttn)
            $("#tripTicket").val(ttn[0].car.id_tripTicket);
            $("#brand").val(ttn[0].car.brand);
            $("#driverName").val(ttn[0].car.driver);
            $("#organization").val(ttn[0].car.organization);
            $("#stateNumber").val(ttn[0].car.stateNumber);
            $("#driverId").val(ttn[0].car.id_driver);
        }
    });
}