export function getTtnPage(req, res) {
    const { user } = res.locals;

    res.render('docs/ttn.ejs', {
        title: "Товарно-транспортная накладная",
        name: user.fullName,
        role: user.role
    });
};

export function getShipmentPage(req, res) {
    const { user } = res.locals;

    res.render('docs/shipment.ejs', {
        title: "Задание на сборку",
        name: user.fullName,
        role: user.role
    });
};