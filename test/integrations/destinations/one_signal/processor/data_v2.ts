import { identifyTests } from './identify';
import { trackTests } from './track';
import { validations } from './validations';
import { groupTests } from './group';
export const data_v2 = [...identifyTests, ...trackTests, ...validations, ...groupTests];
