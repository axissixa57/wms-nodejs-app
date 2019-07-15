export function getContractorsPage(req, res) {
    const { user } = res.locals;

    res.render('handbooks/contractors.ejs', {
        title: "Контрагенты",
        name: user.fullName,
        role: user.role
    });
};

export function getGoodsPage(req, res) {
    const { user } = res.locals;

    res.render('handbooks/goods.ejs', {
        title: "Товары",
        name: user.fullName,
        role: user.role
    });
};

export function getWarehousesPage(req, res) {
    const { user } = res.locals;

    res.render('handbooks/warehouses.ejs', {
        title: "Склады",
        name: user.fullName,
        role: user.role
    });
};