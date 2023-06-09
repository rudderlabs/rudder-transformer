const { ATTRIBUTE_TYPE } = require('./config');

const prepareAttributes = (attributeMap, traits, availableAttributes) =>
  Object.entries(attributeMap).reduce((response, [attribute, mappedAttribute]) => {
    if (traits.hasOwnProperty(attribute)) {
      const traitValue = traits[attribute];
      const matchingAttribute = availableAttributes.find((attr) => attr.key === mappedAttribute);

      if (matchingAttribute) {
        response.push({
          entity_id: matchingAttribute.id,
          key: matchingAttribute.key,
          type: ATTRIBUTE_TYPE,
          value: traitValue,
        });
      }
    }
    return response;
  }, []);

module.exports = { prepareAttributes };
