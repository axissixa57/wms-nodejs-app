import { access } from '../library/helpers';

export function getMainPage(req, res) {
  access(
    res,
    ['admin', 'logist', 'checker', 'economist'],
    'main.ejs',
    'Главная'
  );
}
