export function getRemainderPage(req, res) {
    const { user } = res.locals;

    res.render('reports/remainder.ejs', {
        title: "Остатки товаров на складах",
        name: user.fullName,
        role: user.role
    });
};