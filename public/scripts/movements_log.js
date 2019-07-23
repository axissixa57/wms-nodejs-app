let ROWS = '';
let lineNumber = 0;

function row(ttn) {
  if (ttn.status == 'Разблокирован') {
    bgColor = 'red-bg';
  } else if (ttn.status == 'Заблокирован') {
    bgColor = 'green-bg';
  }

  return `<tr class=${bgColor} data-rowid="${ttn._id}">
                <td>${++lineNumber}</td>
                <td>${ttn.date}</td> 
                <td>${ttn.id_warehouse}</td> 
                <td>${ttn.id_consignee}</td> 
                <td>${ttn.id_doc}</td> 
                <td>${ttn.total_cost}</td> 
                <td>${ttn.total_weight}</td>
                <td>${ttn.status}</td>
                <td>
                    <div class="btn-group">
                        <button type="button" class="btn btn-dark dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Действие
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item openLink" href="/docs/ttn?id=${
                              ttn._id
                            }">Открыть</a> 
                            <a class="dropdown-item removeLink" href="#" data-id="${
                              ttn._id
                            }">Удалить</a>
                        </div>
                    </div>
                </td>
            </tr>`;
}

(function GetTTNs() {
  $.ajax({
    url: '/api/ttns',
    type: 'GET',
    contentType: 'application/json',
    success: function(ttns) {
      let rows = '';
      $.each(ttns, function(index, ttn) {
        rows += row(ttn);
      });

      $('#ttnsDataTable tbody').append(rows);
      ROWS = $('#ttnsDataTable tbody tr');

      $('body').on('click', '.removeLink', function() {
        const id = $(this).data('id');
        if ($(`tr[data-rowid="${id}"]`).hasClass('green-bg')) {
          alert('Документ заблокирован!');
        } else {
          DeleteTTN(id);
        }
      });
    }
  });
})();

function DeleteTTN(id) {
  $.ajax({
    url: '/api/ttn/' + id,
    contentType: 'application/json',
    method: 'DELETE',
    success: function(ttn) {
      PlusProductQuantityOfWarehouse(ttn.id_warehouse, ttn.id_consignee, ttn.products);
      $(`tr[data-rowid="${ttn._id}"]`).remove();
    }
  });
}

function PlusProductQuantityOfWarehouse(docWarehouseID, docConsigneeID, docProducts) {
  $.ajax({
    url: '/api/warehouse/return-quantity',
    contentType: 'application/json',
    method: 'PUT',
    data: JSON.stringify({
      id_warehouse: docWarehouseID,
      id_consignee: docWarehouseID,
      products: docProducts
    })
  });
}

$('#from').on('input', () => {
  let trs = '';

  let value = $('#from').val();
  console.log(ROWS);

  for (const row of ROWS) {
    if (row.children[2].innerHTML.search(value) != -1) {
      trs += row.outerHTML;
    }
  }

  $('#ttnsDataTable tbody').html('');
  $('#ttnsDataTable tbody').append(trs);
});

$('#to').on('input', () => {
  let trs = '';

  let value = $('#to').val();

  for (const row of ROWS) {
    if (row.children[3].innerHTML.search(value) != -1) {
      trs += row.outerHTML;
    }
  }

  $('#ttnsDataTable tbody').html('');
  $('#ttnsDataTable tbody').append(trs);
});

$('#doc').on('input', () => {
  let trs = '';

  let value = $('#doc').val();

  for (const row of ROWS) {
    if (row.children[4].innerHTML.search(value) != -1) {
      trs += row.outerHTML;
    }
  }

  $('#ttnsDataTable tbody').html('');
  $('#ttnsDataTable tbody').append(trs);
});

function toDateMillisec(dateString) {
  const splitDate = dateString.split('.');
  return Date.parse(new Date(splitDate[2], splitDate[1] - 1, splitDate[0]));
}

$('.datepicker-here').datepicker({
  onSelect: () => {
    let trs = '';
    const startDate = $('#startDate').val();
    const finishDate = $('#finishDate').val();
    const from =
      startDate == ''
        ? Date.parse('01 Jan 1970 00:00:00 GMT')
        : toDateMillisec(startDate);
    const to =
      finishDate == '' ? Date.parse(new Date()) : toDateMillisec(finishDate);

    for (const row of ROWS) {
      if (
        from <= toDateMillisec(row.children[1].innerHTML) &&
        to >= toDateMillisec(row.children[1].innerHTML)
      ) {
        trs += row.outerHTML;
      }
    }

    $('#ttnsDataTable tbody').html('');
    $('#ttnsDataTable tbody').append(trs);
  }
});
