let ROWS = '';

function row(product) {
    return `<tr role="row" data-rowid="${product._id}">
                <td>${product._id}</td>
                <td>${product.category}</td> 
                <td>${product.name}</td> 
                <td>${product.unit}</td> 
                <td>${product.weight}</td> 
                <td>${product.cost}</td> 
                <td>
                    <div class="btn-group">
                        <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Действие
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item editLink" data-id="${product._id}" data-toggle="modal" data-target="#EditModal">Редактировать</a>
                            <a class="dropdown-item removeLink" data-id="${product._id}">Удалить</a>
                        </div>
                    </div>
                </td>
            </tr>`;
}

function GetProduct(id) {
    $.ajax({
        url: "/api/products/" + id,
        type: "GET",
        contentType: "application/json",
        success: function (product) {
            $("#EditProductId").val(`${product._id}`);
            $("#EditProductCategory option:first-child").html(`${product.category}`);
            $("#EditProductName").val(`${product.name}`);
            $("#EditProductUnit option:first-child").html(`${product.unit}`);
            $("#EditProductWeight").val(`${product.weight}`);
            $("#EditProductCost").val(`${product.cost}`);
        }
    });
};

(function GetProducts() {
    $.ajax({
        url: "/api/products",
        type: "GET",
        contentType: "application/json",
        success: function (products) {
            let trs = "";
            $.each(products, function (index, product) {
                trs += row(product);
            })
            $("#productDataTable tbody").append(trs);
            ROWS = $("#productDataTable tbody tr")

            $("body").on("click", ".editLink", function () {
                const id = $(this).data("id");
                GetProduct(id);
            })

            $("body").on("click", ".removeLink", function () {
                const id = $(this).data("id");
                DeleteProduct(id);
            })
        }
    });
})();

function CreateProduct(productID, productCategory, productName, productUnit, productWeight, productCost) {
    $.ajax({
        url: "/api/products",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            id: productID,
            category: productCategory,
            name: productName,
            unit: productUnit,
            weight: productWeight,
            cost: productCost,
        }),
        success: function (product) {
            if (typeof product == "object") {
                //$('#btnSave').attr( "data-dismiss", "modal" );
                window.location.reload();
            } else if (typeof product == "string") {
                $('#productId').addClass('is-invalid');
            }
        }
    })
}

function EditProduct(productID, productCategory, productName, productUnit, productWeight, productCost) {
    $.ajax({
        url: "/api/products",
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id: productID,
            category: productCategory,
            name: productName,
            unit: productUnit,
            weight: productWeight,
            cost: productCost,
        }),
    })
}

function DeleteProduct(id) {
    $.ajax({
        url: "/api/products/" + id,
        contentType: "application/json",
        method: "DELETE",
        success: function (product) {
            $(`tr[data-rowid="${product._id}"]`).remove();
        }
    })
}

$('#btnSave').click(() => {
    const id = $('#productId').val();
    const category = $('#productCategory').val();
    const name = $('#productName').val();
    const unit = $('#productUnit').val();
    const weight = $('#productWeight').val();
    const cost = $('#productCost').val();
    CreateProduct(id, category, name, unit, weight, cost);
});

$('#btnEdit').click(() => {
    const id = $('#EditProductId').val();
    const category = $('#EditProductCategory').val() == null ? $('#EditProductCategory option:first-child').html() : $('#EditProductCategory').val();
    const name = $('#EditProductName').val();
    const unit = $('#EditProductUnit').val() == null ? $('#EditProductUnit option:first-child').html() : $('#EditProductUnit').val();
    const weight = $('#EditProductWeight').val(); 
    const cost = $('#EditProductCost').val();
    EditProduct(id, category, name, unit, weight, cost);
    window.location.reload();
});

$('#inputSearch').on('input', () => {
    let trs = '';

    let value = $('#inputSearch').val();

    for (const row of ROWS) {

        for (let i = 0; i < row.children.length - 1; i++) {
            if (row.children[i].innerHTML.search(value) != -1) {
                trs += row.outerHTML;
                break;
            }
        }
    }

    $("#productDataTable tbody").html('');
    $("#productDataTable tbody").append(trs);
})