export type ComplexityLevel = 'simple' | 'medium' | 'complex';

export interface ContextData {
  app?: {
    build: string;
    name: string;
    version: string;
  };
  device?: {
    id: string;
    manufacturer: string;
    model: string;
  };
  library?: {
    name: string;
    version: string;
  };
  locale?: string;
  timezone?: string;
  ip?: string;
  userAgent?: string;
  campaign?: {
    name: string;
    source: string;
    medium: string;
  };
  page?: {
    path: string;
    referrer: string;
    url: string;
  };
  customData?: Record<string, unknown>;
  testBehavior?: unknown;
  endpoint?: string;
}

// ============================================================================
// GENERIC CONTEXT GENERATOR (Reusable across destinations)
// ============================================================================

export class GenericContextGenerator {
  /**
   * Generate context data based on complexity level
   */
  generateContext(complexity: ComplexityLevel): ContextData {
    switch (complexity) {
      case 'simple':
        return {};
      case 'medium':
        return this.generateMediumContext();
      case 'complex':
        return this.generateComplexContext();
      default:
        return {};
    }
  }

  /**
   * Generate medium complexity context
   */
  private generateMediumContext(): ContextData {
    return {
      app: {
        build: '1.0.0',
        name: 'Load Test App',
        version: '2.1.0',
      },
      device: {
        id: this.generateRandomId(),
        manufacturer: 'TestCorp',
        model: `TestDevice-${Math.floor(Math.random() * 10)}`,
      },
      library: {
        name: 'rudder-load-test',
        version: '1.0.0',
      },
      locale: 'en-US',
      timezone: 'America/New_York',
      ip: this.generateRandomIP(),
    };
  }

  /**
   * Generate complex context with additional data
   */
  private generateComplexContext(): ContextData {
    const mediumContext = this.generateMediumContext();

    return {
      ...mediumContext,
      userAgent: this.generateRandomUserAgent(),
      campaign: {
        name: `campaign_${Math.floor(Math.random() * 100)}`,
        source: this.getRandomArrayItem(['google', 'facebook', 'twitter', 'linkedin']),
        medium: this.getRandomArrayItem(['cpc', 'organic', 'email', 'social']),
      },
      page: {
        path: `/page/${Math.floor(Math.random() * 100)}`,
        referrer: `https://example.com/ref/${Math.floor(Math.random() * 50)}`,
        url: `https://example.com/page/${Math.floor(Math.random() * 100)}`,
      },
      customData: this.generateNestedObject(2),
    };
  }

  /**
   * Generate nested object with specified depth
   */
  private generateNestedObject(depth: number): Record<string, unknown> {
    if (depth <= 0) {
      return { value: this.generateRandomString(10) };
    }

    const obj: Record<string, unknown> = {};
    const keys = Math.floor(Math.random() * 5) + 1; // 1-5 keys

    for (let i = 0; i < keys; i++) {
      const key = `key_${i}`;
      if (Math.random() > 0.5 && depth > 1) {
        obj[key] = this.generateNestedObject(depth - 1);
      } else {
        obj[key] = this.generateRandomValue();
      }
    }

    return obj;
  }

  /**
   * Generate random value of various types
   */
  private generateRandomValue(): unknown {
    const types = ['string', 'number', 'boolean', 'array'];
    const type = this.getRandomArrayItem(types);

    switch (type) {
      case 'string':
        return this.generateRandomString(15);
      case 'number':
        return Math.floor(Math.random() * 1000);
      case 'boolean':
        return Math.random() > 0.5;
      case 'array':
        return Array.from({ length: 3 }, () => this.generateRandomString(8));
      default:
        return this.generateRandomString(10);
    }
  }

  /**
   * Get random item from array
   */
  private getRandomArrayItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generate random ID
   */
  private generateRandomId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Generate random string of specified length
   */
  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random IP address
   */
  private generateRandomIP(): string {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
  }

  /**
   * Generate random user agent
   */
  private generateRandomUserAgent(): string {
    const browsers = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    ];
    return this.getRandomArrayItem(browsers);
  }
}

// ============================================================================
// GENERIC FIELD GENERATOR (Reusable across destinations)
// ============================================================================

export class GenericFieldGenerator {
  /**
   * Generate record fields based on complexity level
   */
  generateFields(complexity: ComplexityLevel): Record<string, unknown> {
    switch (complexity) {
      case 'simple':
        return this.generateSimpleFields();
      case 'medium':
        return this.generateMediumFields();
      case 'complex':
        return this.generateComplexFields();
      default:
        return this.generateSimpleFields();
    }
  }

  /**
   * Generate identifiers based on complexity level
   */
  generateIdentifiers(complexity: ComplexityLevel): Record<string, unknown> {
    const base = {
      userId: `user_${this.generateRandomId()}`,
    };

    if (complexity === 'simple') {
      return base;
    }

    return {
      ...base,
      email: `user${Math.floor(Math.random() * 10000)}@loadtest.com`,
      externalId: this.generateRandomId(),
      customerId: `customer_${Math.floor(Math.random() * 1000)}`,
    };
  }

  /**
   * Generate simple fields
   */
  private generateSimpleFields(): Record<string, unknown> {
    return {
      email: `user${Math.floor(Math.random() * 10000)}@loadtest.com`,
      name: `Load Test User ${Math.floor(Math.random() * 1000)}`,
    };
  }

  /**
   * Generate medium complexity fields
   */
  private generateMediumFields(): Record<string, unknown> {
    const simpleFields = this.generateSimpleFields();

    return {
      ...simpleFields,
      age: Math.floor(Math.random() * 80) + 18,
      city: this.getRandomArrayItem(['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']),
      subscription: this.getRandomArrayItem(['free', 'basic', 'premium', 'enterprise']),
      lastActive: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
    };
  }

  /**
   * Generate complex fields with nested data
   */
  private generateComplexFields(): Record<string, unknown> {
    const mediumFields = this.generateMediumFields();

    return {
      ...mediumFields,
      preferences: {
        notifications: Math.random() > 0.5,
        theme: this.getRandomArrayItem(['light', 'dark', 'auto']),
        language: this.getRandomArrayItem(['en', 'es', 'fr', 'de', 'pt']),
        settings: this.generateNestedObject(2),
      },
      metadata: this.generateNestedObject(3),
      customFields: this.generateCustomFields(20),
      tags: this.generateTags(10),
      history: this.generateHistory(5),
    };
  }

  /**
   * Generate custom fields
   */
  private generateCustomFields(count: number): Record<string, string> {
    const fields: Record<string, string> = {};
    for (let i = 0; i < count; i++) {
      fields[`custom_field_${i}`] = this.generateRandomString(30);
    }
    return fields;
  }

  /**
   * Generate tags array
   */
  private generateTags(count: number): string[] {
    return Array.from({ length: count }, () => this.generateRandomString(10));
  }

  /**
   * Generate history array
   */
  private generateHistory(count: number): Array<Record<string, unknown>> {
    return Array.from({ length: count }, (_, i) => ({
      action: `action_${i}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      data: this.generateNestedObject(1),
    }));
  }

  /**
   * Generate nested object with specified depth
   */
  private generateNestedObject(depth: number): Record<string, unknown> {
    if (depth <= 0) {
      return { value: this.generateRandomString(10) };
    }

    const obj: Record<string, unknown> = {};
    const keys = Math.floor(Math.random() * 5) + 1; // 1-5 keys

    for (let i = 0; i < keys; i++) {
      const key = `key_${i}`;
      if (Math.random() > 0.5 && depth > 1) {
        obj[key] = this.generateNestedObject(depth - 1);
      } else {
        obj[key] = this.generateRandomValue();
      }
    }

    return obj;
  }

  /**
   * Generate random value of various types
   */
  private generateRandomValue(): unknown {
    const types = ['string', 'number', 'boolean', 'array'];
    const type = this.getRandomArrayItem(types);

    switch (type) {
      case 'string':
        return this.generateRandomString(15);
      case 'number':
        return Math.floor(Math.random() * 1000);
      case 'boolean':
        return Math.random() > 0.5;
      case 'array':
        return Array.from({ length: 3 }, () => this.generateRandomString(8));
      default:
        return this.generateRandomString(10);
    }
  }

  /**
   * Get random item from array
   */
  private getRandomArrayItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generate random ID
   */
  private generateRandomId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Generate random string of specified length
   */
  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
