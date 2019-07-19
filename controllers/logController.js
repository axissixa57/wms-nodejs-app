import { User } from '../models/User';
//import { UserSession } from '../models/UserSession';
import { myConfig } from '../library/config'

export function getLoginPage(req, res) {
    res.render('account/login.ejs', {
        title: "Авторизация",
    });
};

export async function postDataFromLoginPage(req, res) {
    const { login, password } = req.body

    try {
        const users = await User.find({ login: login });
        if (users.length > 0) {
            const user = users[0];

            if (!user.validPassword(password)) {
                return res.send({
                    success: false,
                    message: 'Неверный пароль.'
                });
            }

            req.session.userId = user._id;

            return res.send({
                success: true,
                message: 'Пользователь найден.'
            });
        } else {
            return res.send({
                success: false,
                message: 'Пользователь не найден.'
            });
        }
    } catch (err) {
        return res.send({
            success: false,
            message: 'Ошибка сервера'
        });
    }
};

export function exitFromApp(req, res) {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/main');
        }

        res.clearCookie(myConfig.session.SESS_NAME);
        res.redirect('/');
    });
};
