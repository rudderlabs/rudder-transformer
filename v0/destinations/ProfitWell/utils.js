const get = require("get-value");
const { removeUndefinedAndNullValues } = require("../../util");

const createSubscriptionPayload = message => {
  let payload = {
    subscription_alias:
      get(message, "traits.subscriptionAlias") ||
      get(message, "context.traits.subscriptionAlias"),
    plan_id:
      get(message, "traits.planId") || get(message, "context.traits.planId"),
    plan_interval:
      get(message, "traits.planInterval") ||
      get(message, "context.traits.planInterval"),
    plan_currency:
      get(message, "traits.planCurrency") ||
      get(message, "context.traits.planCurrency"),
    status:
      get(message, "traits.status") || get(message, "context.traits.status"),
    value: get(message, "traits.value") || get(message, "context.traits.value"),
    effective_date:
      get(message, "traits.effectiveDate") ||
      get(message, "context.traits.effectiveDate") ||
      get(message, "context.originalTimeStamp")
  };

  payload = removeUndefinedAndNullValues(payload);
  return payload;
};

const updateSubscriptionPayload = message => {
  let payload = {
    plan_id:
      get(message, "traits.planId") || get(message, "context.traits.planId"),
    plan_interval:
      get(message, "traits.planInterval") ||
      get(message, "context.traits.planInterval"),
    value: get(message, "traits.value") || get(message, "context.traits.value"),
    status:
      get(message, "traits.status") || get(message, "context.traits.status"),
    effective_date:
      get(message, "traits.effectiveDate") ||
      get(message, "context.traits.effectiveDate")
  };

  payload = removeUndefinedAndNullValues(payload);
  return payload;
};

module.exports = { createSubscriptionPayload, updateSubscriptionPayload };
