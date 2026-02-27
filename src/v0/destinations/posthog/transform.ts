import get from 'get-value';
import {
  InstrumentationError,
  TransformationError,
  isDefinedAndNotNull,
} from '@rudderstack/integrations-lib';
import { EventType } from '../../../constants';
import { DEFAULT_BASE_ENDPOINT, CONFIG_CATEGORIES, MAPPING_CONFIG } from './config';
import {
  defaultRequestConfig,
  getBrowserInfo,
  getDeviceModel,
  constructPayload,
  defaultPostRequestConfig,
  ErrorMessage,
  isValidUrl,
  stripTrailingSlash,
  removeUndefinedAndNullValues,
  simpleProcessRouterDest,
} from '../../util';
import { JSON_MIME_TYPE } from '../../util/constant';
import type { RudderMessage } from '../../../types';
import type {
  PostHogCategory,
  PostHogDestination,
  PostHogMessage,
  PostHogPayload,
  PostHogProcessorRequest,
  PostHogResponseBody,
  PostHogRouterRequest,
} from './types';

// Logic To match destination Property key that is in Rudder Stack Properties Object.
const generatePropertyDefination = (message: PostHogMessage) => {
  const propertyJson = MAPPING_CONFIG.PHPropertiesConfig;
  // Filter out property specific to mobile or web. isMobile key takes care of it.
  // Array Filter() will map propeerty on basis of given condition and filters it.
  // if (message.channel === "mobile") {
  //   propertyJson = propertyJson.filter(d => {
  //     return d.isMobile || d.all;
  //   });
  // } else {
  //   propertyJson = propertyJson.filter(d => {
  //     return !d.isMobile || d.all;
  //   });
  // }

  let data = constructPayload(message, propertyJson)!;

  // This logic ensures to get browser info only for payload generated from web.
  if (message.channel === 'web' && message.context && message.context.userAgent) {
    const browser = getBrowserInfo(message.context.userAgent);
    const osInfo = getDeviceModel(message);
    data.$os = osInfo;
    data.$browser = browser.name;
    data.$browser_version = browser.version;
  }

  // For EventType Screen Posthog maps screen name to our event property.
  if (message.type === EventType.SCREEN) {
    data.$screen_name = message.event;
  }

  // Validate current url from payload and generate host form that url.
  const url = isValidUrl(data.$current_url);
  if (url) {
    data.$host = url.host;
  }

  // It pass the user traits in $set -> its an user Properties
  // For identify, we are mapping it from PHIdentifyConfig file.
  const userTraits = message.context?.traits;
  if (message.type.toLowerCase() !== EventType.IDENTIFY && userTraits) {
    data = {
      $set: userTraits,
      ...data,
    };
  }

  return removeUndefinedAndNullValues(data);
};

const responseBuilderSimple = (
  message: RudderMessage,
  category: PostHogCategory,
  destination: PostHogDestination,
) => {
  // This is to ensure backward compatibility of group calls.
  let payload: PostHogPayload | null;
  if (category.type === 'group' && destination.Config.useV2Group) {
    payload = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.GROUPV2.name]);
  } else {
    payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  }
  if (!payload) {
    // fail-safety for developer error
    throw new TransformationError(ErrorMessage.FailedToConstructPayload);
  }

  if (!payload.timestamp && isDefinedAndNotNull(payload.properties?.timestamp)) {
    payload.timestamp = payload.properties.timestamp;
  }

  payload.properties = {
    ...generatePropertyDefination(message),
    ...payload.properties,
  };

  if (category.type === CONFIG_CATEGORIES.GROUP.type) {
    // This is to ensure groupType delete from $group_set, as it is properly mapped
    // in 'properties.$group_type'.
    if (destination.Config.useV2Group) {
      delete payload?.properties?.$group_set?.groupType;
    }
    // This will add the attributes $groups, which will associate the group with the user.
    if (payload.properties) {
      const groupType = get(payload, 'properties.$group_type');
      const groupKey = get(payload, 'properties.$group_key');
      if (groupType && groupKey) {
        payload.properties.$groups = {
          [groupType]: groupKey,
        };
      }
    }
  }

  // Convert the distinct_id to string as that is the needed type in destinations.
  if (isDefinedAndNotNull(payload.distinct_id)) {
    payload.distinct_id = payload.distinct_id.toString();
  }
  if (payload.properties && isDefinedAndNotNull(payload.properties.distinct_id)) {
    payload.properties.distinct_id = payload.properties.distinct_id.toString();
  }

  // Mapping Destination Event with correct value
  if (category.type !== CONFIG_CATEGORIES.TRACK.type) {
    payload.event = category.event;
  }

  const responseBody: PostHogResponseBody = {
    ...payload,
    api_key: destination.Config.teamApiKey,
    type: category.type,
  };
  const response = defaultRequestConfig();
  response.endpoint = `${
    stripTrailingSlash(destination.Config.yourInstance) || DEFAULT_BASE_ENDPOINT
  }/batch`;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
  };
  response.body.JSON = responseBody;
  return response;
};

const isValidCategoryKey = (key: string): key is keyof typeof CONFIG_CATEGORIES =>
  key in CONFIG_CATEGORIES;

const processEvent = (message: RudderMessage, destination: PostHogDestination) => {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  const key = message.type.toUpperCase();
  if (!isValidCategoryKey(key)) {
    throw new InstrumentationError(`Event type ${message.type} is not supported`);
  }

  return responseBuilderSimple(message, CONFIG_CATEGORIES[key], destination);
};

const process = (event: PostHogProcessorRequest) => processEvent(event.message, event.destination);

const processRouterDest = async (
  inputs: PostHogRouterRequest[],
  reqMetadata: Record<string, unknown>,
) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata, undefined);
  return respList;
};

export { process, processRouterDest };
