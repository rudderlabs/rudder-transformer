import { chunk } from 'lodash';
import { maxBatchSize } from './config';

interface Product {
  price?: number;
  quantity?: number;
}

interface Properties {
  products?: Product[];
  price?: number;
  quantity?: number;
  revenue?: number;
}

interface EventMetadata {
  destination: string;
  metadata: unknown;
  message: {
    body: {
      JSON: {
        events: unknown[];
      };
    };
  }[];
}

interface BatchedResponse {
  destination: string;
  message: {
    body: {
      JSON: {
        events: unknown[];
      };
    };
  };
  metadata: unknown[];
}

const batchEventChunks = (eventChunks: EventMetadata[][]): BatchedResponse[] => {
  // Return empty array if input is not an array or empty
  if (!Array.isArray(eventChunks) || eventChunks.length === 0) {
    return [];
  }

  return eventChunks.map((eventChunk) => {
    const [firstEvent, ...restEvents] = eventChunk;

    // Initialize response with first event's data
    const response: BatchedResponse = {
      destination: firstEvent.destination,
      message: firstEvent.message[0],
      metadata: [firstEvent.metadata],
    };

    // Add remaining events' data
    restEvents.forEach((event) => {
      response.message.body.JSON.events.push(...event.message[0].body.JSON.events);
      response.metadata.push(event.metadata);
    });

    return response;
  });
};

const batchEvents = (successfulEvents: EventMetadata[]): BatchedResponse[] => {
  const eventChunks = chunk(successfulEvents, maxBatchSize);
  return batchEventChunks(eventChunks);
};

const calculateDefaultRevenue = (properties: Properties): number | null => {
  // Check if working with products array
  if (properties?.products && properties.products.length > 0) {
    // Check if all product prices are undefined
    if (properties.products.every((product) => product.price === undefined)) {
      return null; // Return null if all product prices are undefined
    }
    // Proceed with calculation if not all prices are undefined
    return properties.products.reduce(
      (acc, product) => acc + (product.price || 0) * (product.quantity || 1),
      0,
    );
  }
  const { price, quantity } = properties;
  return price ? price * (quantity ?? 1) : null;
};

const populateRevenueField = (eventType: string, properties: Properties): number | null => {
  let revenueInCents: number | null;
  let revenue: number | null;
  switch (eventType) {
    case 'Purchase':
      revenueInCents =
        properties.revenue && !Number.isNaN(properties.revenue)
          ? Math.round(Number(properties.revenue) * 100)
          : null;
      break;
    case 'AddToCart':
      revenueInCents =
        properties.price && !Number.isNaN(properties.price)
          ? Math.round(Number(properties.price) * Number(properties.quantity || 1) * 100)
          : null;
      break;
    default:
      // for viewContent
      revenue = calculateDefaultRevenue(properties);
      revenueInCents = revenue ? revenue * 100 : null;
      break;
  }

  if (Number.isNaN(revenueInCents)) {
    return null;
  }
  // Return the value as it is if it's not NaN
  return revenueInCents;
};

export {
  batchEvents,
  batchEventChunks,
  populateRevenueField,
  calculateDefaultRevenue,
  // Also export types for testing
  type EventMetadata,
  type BatchedResponse,
  type Properties,
  type Product,
};
