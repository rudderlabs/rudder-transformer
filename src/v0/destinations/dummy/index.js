/**
 * Index file for the dummy destination
 * This file exports all the functions needed for the dummy destination
 */

const { process, processRouterDest } = require('./transform');
const { process: processUserDeletion, processUserDeletionBatch } = require('./userDeletion');

module.exports = {
  process,
  processRouterDest,
  processUserDeletion,
  processUserDeletionBatch,
};
