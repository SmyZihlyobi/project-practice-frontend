import RuCensor from 'russian-bad-word-censor';

/*
 * !!! ЕСЛИ ЧТО ТО ПОЙДЁТ НЕ ТАК ПИСАТЬ В ТГ https://t.me/IvanMalkS или открывать ишью на гите https://github.com/IvanMalkS/bad-words-js !!!
 *
 * Выводить маты даже на защищённой странице с проектами не самая прекрасная идея...
 * Поэтому ставим небольшую валидацию, делая иллюзию защиты.
 * Strict - лучше использовать на каких то названиях и прочих,
 * чтобы никого не оскорбить, не пропустив фамилию или имя,
 * которые случайно имеют корни похожие на корни матерных слов.
 * Если есть слово которое хотим добавить в исключение или наоборот запретить вот дока https://www.npmjs.com/package/russian-bad-word-censor.
 *
 * С ❤️ от Малкова И.С.
 */

export const ruCensorStrict = new RuCensor('strict');
export const ruCensor = new RuCensor('normal');
