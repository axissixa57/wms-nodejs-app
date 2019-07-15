export function getTtnPage(req, res) {
    const { user } = res.locals;
    const ttnID = req.query.id;
    console.log(ttnID)

    res.render('docs/ttn.ejs', {
        title: "Товарно-транспортная накладная",
        name: user.fullName,
        role: user.role,
        ttnID: ttnID
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