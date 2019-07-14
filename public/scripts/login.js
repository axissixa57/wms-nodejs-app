async function GetUser(signInLogin, signInPassword) {
    const request = await fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login: signInLogin,
            password: signInPassword,
        }),
    });

    const response = await request.json();

    if (response.success) {
        document.location.href = '/main';
    }
    else {
        alert(response.message);
    }
}

function validation() {
    const inputLogin = $('#inputLogin').val();
    const inputPassword = $('#inputPassword').val();

    if (!inputLogin.length > 0) {
        $('.invalid-login').html('Введите логин.');
        $('#inputLogin').addClass('is-invalid');
        return;
    } else {
        $('#inputLogin').removeClass('is-invalid');
    }

    if (!inputPassword.length > 0) {
        $('.invalid-password').html('Введите пароль.');
        $('#inputPassword').addClass('is-invalid');
        return;
    } else {
        $('#inputPassword').removeClass('is-invalid');
    }

    if (inputLogin.length > 0 && inputPassword.length > 0) {
        GetUser(inputLogin, inputPassword);
    }
}

$('#enter').on('click', validation);