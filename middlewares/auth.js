export const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/');
    } else {
        next();
    }
}

export const redirectMain = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/main');
    } else {
        next();
    }
}