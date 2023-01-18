const customerEventNameMap = {
  subscribed: 'Customer Subscribed',
  unsubscribed: 'Customer Unsubscribed',
};

const emailEventNameMap = {
  failed: 'Email Failed',
  spammed: 'Email Marked as Spam',
  dropped: 'Email Dropped',
  bounced: 'Email Bounced',
  unsubscribed: 'Email Unsubscribed',
  converted: 'Email Converted',
  clicked: 'Email Link Clicked',
  opened: 'Email Opened',
  delivered: 'Email Delivered',
  sent: 'Email Sent',
  attempted: 'Email Attempted',
  drafted: 'Email Drafted',
};

const smsEventNameMap = {
  failed: 'SMS Failed',
  bounced: 'SMS Bounced',
  converted: 'SMS Converted',
  clicked: 'SMS Link Clicked',
  delivered: 'SMS Delivered',
  sent: 'SMS Sent',
  attempted: 'SMS Attempted',
  drafted: 'SMS Drafted',
};

const pushEventNameMap = {
  failed: 'Push Failed',
  dropped: 'Push Dropped',
  bounced: 'Push Bounced',
  converted: 'Push Converted',
  clicked: 'Push Link Clicked',
  opened: 'Push Opened',
  sent: 'Push Sent',
  attempted: 'Push Attempted',
  drafted: 'Push Drafted',
};

const slackEventNameMap = {
  failed: 'Slack Message Failed',
  clicked: 'Slack Message Link Clicked',
  sent: 'Slack Message Sent',
  attempted: 'Slack Message Attempted',
  drafted: 'Slack Message Drafted',
};

const webhookEventNameMap = {
  failed: 'Webhook Message Failed',
  clicked: 'Webhook Message Link Clicked',
  sent: 'Webhook Message Sent',
  attempted: 'Webhook Message Attempted',
  drafted: 'Webhook Message Drafted',
};

const mappingConfig = {
  customer: customerEventNameMap,
  email: emailEventNameMap,
  sms: smsEventNameMap,
  push: pushEventNameMap,
  slack: slackEventNameMap,
  webhook: webhookEventNameMap,
};

module.exports = {
  customerEventNameMap,
  emailEventNameMap,
  smsEventNameMap,
  pushEventNameMap,
  slackEventNameMap,
  webhookEventNameMap,
  mappingConfig,
};
