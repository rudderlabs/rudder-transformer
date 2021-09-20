const USER_LEAD_CACHE_TTL = process.env.MARKETO_LEAD_CACHE_TTL
  ? parseInt(process.env.MARKETO_LEAD_CACHE_TTL, 10)
  : 24 * 60 * 60;

const AUTH_CACHE_TTL = process.env.MARKETO_AUTH_CACHE_TTL
  ? parseInt(process.env.MARKETO_AUTH_CACHE_TTL, 10)
  : 60 * 60;

const API_CALL = "api_call_count";

const STATS_PRIORITY = {
  P1: "priority_one",
  P2: "priority_two",
  P3: "priority_three"
};

const TRANSFORMER_STAGE = {
  TRANSFORM: "transform",
  PROXY: "proxy"
};

module.exports = {
  API_CALL,
  AUTH_CACHE_TTL,
  STATS_PRIORITY,
  TRANSFORMER_STAGE,
  USER_LEAD_CACHE_TTL
};
