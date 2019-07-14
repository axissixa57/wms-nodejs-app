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
            inputResult.value = optionsAll[i].children[0].innerHTML;
            hideModalScrollable(someModalScrollable);
        });
    }

    btnChoose.addEventListener('click', () => {
        for (let i = 0; i < optionsAll.length; i++) {
            if (optionsAll[i].classList.contains('selected')) {
                inputResult.value = optionsAll[i].children[0].innerHTML;
                hideModalScrollable(someModalScrollable);
            }
        }
    });
}

function GetProduct(id) {
    $.ajax({
        url: "http://localhost:3000/api/products/" + id,
        type: "GET",
        contentType: "application/json",
        success: function(product) {
            $(".mainTableOfGoods tbody").append(row(product));
        }
    });
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

function row(product) {
    return `<tr onclick="markRow(this)">
                <td>${product._id}</td>
                <td>${product.category}</td> 
                <td>${product.name}</td> 
                <td onclick="markInputQuantity(this)">
                    <div class="col">
                        <input type="text" class="form-control form-control-lg" id="quantity" name="quantity" oninput="countTotalWeight()">
                    </div>
                </td> 
                <td>${product.unit}</td> 
                <td>${product.weight}</td> 
                <td>
                    ${toKg(product.weight, product.unit)}
                </td>
            </tr>`;
}

function rowForReference(obj) {
    return `<tr role="row">
                <td>${obj._id}</td>
                <td style="text-align: left;">${obj.address}</td>
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

function countTotalWeight() {
    let totalWeight = 0;
    const trsMainTable = document.querySelectorAll('.mainTableOfGoods tbody tr');

    for (let i = 0; i < trsMainTable.length; i++) {
        const weight = parseFloat(trsMainTable[i].children[6].innerHTML);
        const quantity = parseInt(trsMainTable[i].children[3].children[0].children[0].value);

        if (typeof quantity == "number" && quantity > 0) {
            totalWeight += weight * quantity;
        }
    }

    $("#total_weight").val(totalWeight);
}

// delete rows of MainTable
const btnDelete = document.querySelector('.btnDelete');
const rowDelete = () => {
    const trsMainTable = document.querySelectorAll('.mainTableOfGoods tr');
    for (let i = 0; i < trsMainTable.length; i++) {
        const tBody = trsMainTable[i].parentNode;

        if (trsMainTable[i].classList.contains('marked')) {
            tBody.removeChild(trsMainTable[i]);
        }
    }
}

btnDelete.addEventListener('click', rowDelete);

// with key Del
// document.addEventListener('keydown', () => {
//     if (event.keyCode == 46) rowDelete();
// });

const inputShipmentId = document.getElementById('shipment_id');
// uniq id
inputShipmentId.value = Math.floor(new Date().getTime() / 100 - 15500000000);

function CreateShipment(shipmentID, date, status, warehouseID, dateShipment, consigneeID, products, pallet, total_weight) {
    $.ajax({
        url: "http://localhost:3000/api/shipments",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            shipment_id: shipmentID,
            date: date,
            status: status,
            warehouse_id: warehouseID,
            shipment_date: dateShipment,
            consignee_id: consigneeID,
            products: products,
            pallet: pallet,
            total_weight: total_weight
        }),
        success: function(shipment) {
            $('.toast').toast('show');
        },
    })
}

function dateToRUFormat(date) {
    const del = date.slice(0, 3);
    const dateRU = date.replace(/[0-9]+./, '').split('');
    dateRU.splice(3, 0, del);
    return newdate = dateRU.join('');
}

$("form").submit(function(e) {
    e.preventDefault();
    const id = this.elements["shipment_id"].value;
    const date = dateToRUFormat(this.elements["date"].value);
    const status = this.elements["status"].value;
    const warehouse = this.elements["warehouse_id"].value;
    const dateShipment = dateToRUFormat(this.elements["date_shipment"].value);
    const consignee = this.elements["consignee_id"].value;

    let pallet = $("#pallet").val();
    let total_weight = $("#total_weight").val();

    const trsMainTable = document.querySelectorAll('.mainTableOfGoods tbody tr');
    const products = [];
    for (let i = 0; i < trsMainTable.length; i++) {
        products[i] = {
            id: trsMainTable[i].children[0].innerHTML,
            quantity: trsMainTable[i].children[3].children[0].children[0].value
        };
    }

    CreateShipment(id, date, status, warehouse, dateShipment, consignee, products, pallet, total_weight);
});

(function GetConsignees() {
    $.ajax({
        url: "http://localhost:3000/api/consignees",
        type: "GET",
        contentType: "application/json",
        success: function(consignees) {
            let tds = "";

            $.each(consignees, function(index, consignee) {
                tds += rowForReference(consignee);
            });
            
            $("#all_consignees tbody").append(tds);

            const consigneesALL = document.querySelectorAll('#all_consignees tbody tr');
            const consigneeID = document.getElementById('consignee_id');
            const btnConsignees = document.getElementById('btnConsignees');
            const receiverOfGoodsModalScrollable = document.getElementById('receiverOfGoodsModalScrollable');

            toColorizeSelectedPositionAndChooseValue(consigneesALL, consigneeID, btnConsignees, receiverOfGoodsModalScrollable);
        }
    });
})();

(function GetWarehouses() {
    $.ajax({
        url: "http://localhost:3000/api/warehouses",
        type: "GET",
        contentType: "application/json",
        success: function(warehouses) {
            let tds = "";
            $.each(warehouses, function(index, warehouse) {
                tds += rowForReference(warehouse);
            })
            $("#all_warehouses tbody").append(tds);

            const warehousesALL = document.querySelectorAll('#all_warehouses tbody tr');
            const warehouseID = document.getElementById('warehouse_id');
            const btnWarehouses = document.getElementById('btnWarehouses');
            const warehouseModalScrollable = document.getElementById('warehouseModalScrollable');

            toColorizeSelectedPositionAndChooseValue(warehousesALL, warehouseID, btnWarehouses, warehouseModalScrollable);
        }
    });
})();

function rowForProductCategoryTable(product) {
    return `<tr role="row">
                <td>${product.name}</td>
                <td style="text-align: right;">${product._id}</td> 
            </tr>`;
}

(function GetCosmeticProducts() {
    $.ajax({
        url: "http://localhost:3000/api/products/cosmetics",
        type: "GET",
        contentType: "application/json",
        success: function(products) {

            let trs = "";
            $.each(products, function(index, product) {
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
})();

(function GetMeatProducts() {
    $.ajax({
        url: "http://localhost:3000/api/products/meat",
        type: "GET",
        contentType: "application/json",
        success: function(products) {
            let trs = "";
            $.each(products, function(index, product) {
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
})();

(function GetMarineProducts() {
    $.ajax({
        url: "http://localhost:3000/api/products/marine",
        type: "GET",
        contentType: "application/json",
        success: function(products) {
            let trs = "";
            $.each(products, function(index, product) {
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
})();
