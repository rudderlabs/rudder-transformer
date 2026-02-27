/**
 * Main processor test data for Survicate destination
 * Combines all processor test cases for identify, group, and track events
 */

import { data as identifyData } from './identify';
import { data as groupData } from './group';
import { data as trackData } from './track';

export const data = [...identifyData, ...groupData, ...trackData];
