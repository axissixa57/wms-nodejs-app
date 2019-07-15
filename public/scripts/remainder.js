let lineNumber = 0;
let ROWS = '';

function row(warehouseInfo) {
    let trs = '';

    for (let i = 0; i < warehouseInfo.products.length; i++) {
        trs += `<tr>
                    <td>${++lineNumber}</td> 
                    <td>${warehouseInfo.products[i].description._id}</td>
                    <td>${warehouseInfo.products[i].description.category}</td> 
                    <td>${warehouseInfo.products[i].description.name}</td> 
                    <td>${warehouseInfo.products[i].description.unit}</td> 
                    <td>${warehouseInfo.products[i].description.weight}</td> 
                    <td>${warehouseInfo.products[i].description.cost}</td> 
                    <td>${warehouseInfo._id}</td> 
                    <td>${warehouseInfo.products[i].storage_location}</td> 
                    <td>${warehouseInfo.products[i].quantity}</td> 
                </tr>`;
    }

    return trs;
}

(function GetRemainders() {
    $.ajax({
        url: "/api/remainders",
        type: "GET",
        contentType: "application/json",
        success: function (remainders) {
            const warehousesInfo = remainders.warehouses;
            const productsInfo = remainders.products;

            for (let i = 0; i < warehousesInfo.length; i++) {
                for (let j = 0; j < warehousesInfo[i].products.length; j++) {
                    for (let k = 0; k < productsInfo.length; k++) {
                        if (warehousesInfo[i].products[j].id_product == productsInfo[k]._id) {
                            warehousesInfo[i].products[j].description = productsInfo[k];
                        }
                    }
                }
            }

            console.log(warehousesInfo);

            let trs = "";
            $.each(warehousesInfo, function (index, warehouseInfo) {
                trs += row(warehouseInfo);
            })
            $("#remainderDataTable tbody").append(trs);

            ROWS = $("#remainderDataTable tbody tr");
        }
    });
})();

$('#countRows').change(() => {
    const count = parseInt($('#countRows').val());
    const trs = ROWS;
    let trsNew = '';

    for (let i = 0; i < count && i < trs.length; i++) {
        trsNew += trs[i].outerHTML;
    }

    $("#remainderDataTable tbody").html('');
    $("#remainderDataTable tbody").append(trsNew);
});

$('#inputSearch').on('input', () => {
    console.log(123)
    let trs = '';
    let value = $('#inputSearch').val();

    for (const row of ROWS) {

        for (let i = 1; i < row.children.length; i++) {
            if (row.children[i].innerHTML.search(value) != -1) {
                trs += row.outerHTML;
                break;
            }
        }
    }

    $("#remainderDataTable tbody").html('');
    $("#remainderDataTable tbody").append(trs);
})

$('.btnPrint').on('click', () => {
    window.open('/templates/remainder');
});