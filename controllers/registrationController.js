import { User } from '../models/User';
import { access } from '../library/helpers';

export function getRegistrationPage(req, res) {
  access(
    res,
    ['admin'],
    'account/registration.ejs',
    'Регистрация нового пользователя'
  );
}

export function postDataFromRegistrationPage(req, res) {
  const { login, password, email, fullName, role } = req.body;

  User.find(
    {
      login: login
    },
    (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Server error.'
        });
      } else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          message: 'Профиль с таким логином уже существует.'
        });
      }

      const newUser = new User();
      newUser.login = login;
      newUser.password = newUser.generateHash(password);
      newUser.email = email;
      newUser.fullName = fullName;
      newUser.role = role;
      newUser.save((err, user) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Server errror.'
          });
        }
        return res.send({
          success: true,
          message: 'Signed up.'
        });
      });
    }
  );
}
