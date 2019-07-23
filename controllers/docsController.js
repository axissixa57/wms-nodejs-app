import { access } from '../library/helpers';

export function getTtnPage(req, res) {
  const ttnID = req.query.id;

  access(
    res,
    ['admin', 'economist'],
    'docs/ttn.ejs',
    'Товарно-транспортная накладная',
    { ttnID }
  );
}

export function getShipmentPage(req, res) {
  access(
    res,
    ['admin', 'logist', 'checker'],
    'docs/shipment.ejs',
    'Задание на сборку'
  );
}
