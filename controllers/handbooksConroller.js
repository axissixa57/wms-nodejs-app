import { access } from '../library/helpers'

export function getContractorsPage(req, res) {
    access(res, ['admin', 'logist', 'checker', 'economist'], 'handbooks/contractors.ejs', 'Контрагенты');
};

export function getGoodsPage(req, res) {
    access(res, ['admin', 'logist', 'checker', 'economist'], 'handbooks/goods.ejs', 'Товары');
};

export function getWarehousesPage(req, res) {
    access(res, ['admin', 'logist', 'checker', 'economist'], 'handbooks/warehouses.ejs', 'Склады');
};