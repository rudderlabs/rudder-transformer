const { getMappingConfig } = require('../../../../v0/util');

const ConfigCategories = {
  TRACK: {
    type: 'track',
    name: 'propertiesMapping',
  },
};
const mappingConfig = getMappingConfig(ConfigCategories, __dirname);
// Following contains the keys at item level mapping where key can be considered as destkey and value can be considered as sourcekey
const productProperties = {
  skulist: 'sku',
  qlist: 'quantity',
  namelist: 'name',
  brandlist: 'brand',
  couponlist: 'coupon',
  catidlist: 'categoryId',
  catlist: 'category',
  disamtlist: 'discountAmount',
  distypelist: 'discountType',
  isclearancelist: 'isClearance',
  ismarketplacelist: 'isMarketPlace',
  issalelist: 'isSale',
  itmstatuslist: 'itmStatus',
  marginlist: 'margin',
  markdownlist: 'markdown',
  shipidlist: 'shipId',
  shipbylist: 'shipBy',
  taxexemptlist: 'taxExempt',
  sequencelist: 'sequence',
};
// list of all properties that are required
const requiredProductProperties = ['skulist', 'qlist', 'namelist'];
module.exports = { ConfigCategories, mappingConfig, productProperties, requiredProductProperties };
