import { access } from '../library/helpers'

export function getRemainderPage(req, res) {
    access(res, ['admin', 'economist'], 'reports/remainder.ejs', 'Остатки товаров на складах');
};