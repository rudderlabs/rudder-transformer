import bourne from '@hapi/bourne';

export interface ParseResult {
  parsed: any;
  error?: {
    message: string;
    status: number;
    name: string;
  };
}
export default async function parseJson(rawBody: string): Promise<ParseResult> {
  try {
    const parsed = await bourne.parse(rawBody, { protoAction: 'error' });
    return { parsed };
  } catch (error: any) {
    return {
      parsed: null,
      error: {
        message: error.message,
        status: error.status || 400,
        name: error.name,
      },
    };
  }
}
