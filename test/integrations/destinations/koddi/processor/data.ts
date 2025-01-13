import { impressions } from './impressions';
import { clicks } from './clicks';
import { conversions } from './conversions';

export const data = [...impressions, ...clicks, ...conversions];
