import { RuCensor } from 'russian-bad-word-censor';

RuCensor.addBadWordPattern('[с][о][с][а][л]');
RuCensor.addBadWordPattern('[Г][и][т][л][е][р]');
export const ruCensor = RuCensor;
