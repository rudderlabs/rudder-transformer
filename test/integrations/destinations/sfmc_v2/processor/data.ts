import { accessTokenTests } from './accessToken';
import { contactTests } from './contact';
import { dataExtensionTests } from './dataExtension';

export const data = [...contactTests, ...accessTokenTests, ...dataExtensionTests];
