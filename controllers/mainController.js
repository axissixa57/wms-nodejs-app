export function getMainPage(req, res) {
    const { user } = res.locals;

    res.render('main.ejs', {
        title: "Главная",
        name: user.fullName,
        role: user.role
    });
};