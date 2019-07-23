async function CreateUser(
  signUpLogin,
  signUpPassword,
  signUpEmail,
  signUpFullName,
  signUpRole
) {
  const request = await fetch('/registration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      login: signUpLogin,
      password: signUpPassword,
      email: signUpEmail,
      fullName: signUpFullName,
      role: signUpRole
    })
  });

  const response = await request.json();

  if (response.success) {
    $('#alertBlock').html(
      showAlert(
        'Пользователь успешно зарегестрирован',
        'alert-success',
        'Поздравляем!'
      )
    );
  } else {
    $('#alertBlock').html(
      showAlert(response.message, 'alert-danger', 'Ошибка!')
    );
  }
}

function showAlert(message, statusAlert, statusMessage) {
  return `<div id="alert" class="alert ${statusAlert} alert-dismissible fade show" role="alert">
                <strong>${statusMessage}</strong> ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
}

function validation() {
  const inputLogin = $('#login').val();
  const inputPassword = $('#password').val();
  const inputRepeatPassword = $('#repeat_password').val();
  const inputFIO = $('#fio').val();
  const inputEmail = $('#email').val();
  const selectRole = $('#role').val();

  if (!inputLogin.length > 0) {
    $('#alertBlock').html(
      showAlert('Логин не должен быть пустым.', 'alert-danger', 'Ошибка!')
    );
    return;
  }
  if (!inputPassword.length > 0 && !inputRepeatPassword > 0) {
    $('#alertBlock').html(
      showAlert('Пароль не должен быть пустым.', 'alert-danger', 'Ошибка!')
    );
    return;
  }
  if (inputPassword != inputRepeatPassword) {
    $('#alertBlock').html(
      showAlert('Пароли не совпадают.', 'alert-danger', 'Ошибка!')
    );
    return;
  }
  if (!inputFIO.length > 0) {
    $('#alertBlock').html(showAlert('Введите ФИО', 'alert-danger', 'Ошибка!'));
    return;
  }
  if (!inputEmail.length > 0) {
    $('#alertBlock').html(
      showAlert('Введите почтовый адрес', 'alert-danger', 'Ошибка!')
    );
    return;
  }
  if (selectRole == null) {
    $('#alertBlock').html(
      showAlert('Введите роль пользователя', 'alert-danger', 'Ошибка!')
    );
    return;
  }

  CreateUser(inputLogin, inputPassword, inputEmail, inputFIO, selectRole);
}

$('#submit').on('click', validation);
