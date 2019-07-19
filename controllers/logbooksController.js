import { access } from '../library/helpers'

export function getLogbookShipmentsPage(req, res) {
    const { user } = res.locals;

    res.render('logbooks/shipments.ejs', {
        title: "Журнал сборок на отгрузку",
        name: user.fullName,
        role: user.role
    });
};

export function getLogbookMovementsPage(req, res) {
    access(res, ['admin', 'economist'], 'logbooks/movements.ejs', 'Журнал перемещений');
};