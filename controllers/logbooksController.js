export function getLogbookShipmentsPage(req, res) {
    const { user } = res.locals;

    res.render('logbooks/shipments.ejs', {
        title: "Журнал сборок на отгрузку",
        name: user.fullName,
        role: user.role
    });
};

export function getLogbookMovementsPage(req, res) {
    const { user } = res.locals;

    res.render('logbooks/movements.ejs', {
        title: "Журнал перемещений",
        name: user.fullName,
        role: user.role
    });
};