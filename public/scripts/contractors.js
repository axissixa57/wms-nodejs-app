let ROWS = '';
let lineNumber = 0;

function row(contractor) {
    return `<tr role="row" data-rowid="${contractor._id}">
                <td>${++lineNumber}</td>
                <td>${contractor._id}</td>
                <td>${contractor.address}</td> 
                <td>${contractor.phone}</td> 
                <td>
                    <div class="btn-group">
                        <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Действие
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item editLink" data-id="${contractor._id}" data-toggle="modal" data-target="#EditModal">Редактировать</a>
                            <a class="dropdown-item removeLink" data-id="${contractor._id}">Удалить</a>
                        </div>
                    </div>
                </td>
            </tr>`;
}

function reset() {
    let form = document.forms["contractorAddForm"];
    form.reset();
}

function validatePhoneNumber(input) {
    let regPhoneNumber = /^[(]{1}[0-9]{3}[)]{1} [0-9]{1}[-]{1}[0-9]{3}[-]{1}[0-9]{3}$/;
    if (regPhoneNumber.test($(input).val()) == false) {
        $(input).addClass('is-invalid');
        return false;
    }
    return true;
}

function GetContractor(id) {
    $.ajax({
        url: "/api/consignees/" + id,
        type: "GET",
        contentType: "application/json",
        success: function (contractor) {
            $("#EditContractorId").val(`${contractor._id}`);
            $("#EditContractorAddress").val(`${contractor.address}`);
            $("#EditContractorPhone").val(`${contractor.phone}`);
        }
    });
};

(function GetContractors() {
    $.ajax({
        url: "/api/consignees",
        type: "GET",
        contentType: "application/json",
        success: function (contractors) {
            let trs = "";
            $.each(contractors, function (index, contractor) {
                trs += row(contractor);
            })
            $("#contractorDataTable tbody").append(trs);
            ROWS = $("#contractorDataTable tbody tr");

            $("body").on("click", ".editLink", function () {
                const id = $(this).data("id");
                GetContractor(id);
            })

            $("body").on("click", ".removeLink", function () {
                const id = $(this).data("id");
                DeleteContractor(id);
            })
        }
    });
})();

function CreateContractor(contractorID, contractorAddress, contractorPhone) {
    $.ajax({
        url: "/api/consignees",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            id: contractorID,
            address: contractorAddress,
            phone: contractorPhone,
        }),
        success: function (contractor) {
            if (typeof contractor == "object") {
                $("#contractorDataTable tbody").append(row(contractor));
                reset();
            } else if (typeof contractor == "string") {
                $('#contractorId').addClass('is-invalid');
            }
        }
    })
}

function EditContractor(contractorID, contractorAddress, contractorPhone) {
    $.ajax({
        url: "/api/consignees",
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id: contractorID,
            address: contractorAddress,
            phone: contractorPhone,
        }),
        // success: function (contractor) {
        //     $(`tr[data-rowid="${contractor._id}"]`).replaceWith(row(contractor));
        // }
    })
}

function DeleteContractor(id) {
    $.ajax({
        url: "/api/consignees/" + id,
        contentType: "application/json",
        method: "DELETE",
        success: function (contractor) {
            $(`tr[data-rowid="${contractor._id}"]`).remove();
        }
    })
}

$('#btnSave').click(() => {
    const id = $('#contractorId').val();
    const address = $('#contractorAddress').val();
    const phone = $('#contractorPhone').val();
    if (validatePhoneNumber('#contractorPhone')) {
        CreateContractor(id, address, phone);
    }
});

$('#btnEdit').click(() => {
    const id = $('#EditContractorId').val();
    const address = $('#EditContractorAddress').val();
    const phone = $('#EditContractorPhone').val();

    if (validatePhoneNumber('#EditContractorPhone')) {
        EditContractor(id, address, phone);
        window.location.reload();
    }
});

$('#inputSearch').on('input', () => {
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

    $("#contractorDataTable tbody").html('');
    $("#contractorDataTable tbody").append(trs);
})