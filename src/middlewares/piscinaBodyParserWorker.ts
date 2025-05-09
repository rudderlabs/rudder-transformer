import bourne from '@hapi/bourne';

export interface ParseResult {
  parsed: any;
  error?: {
    message: string;
    status: number;
    name: string;
  };
}
export default async function parseJson({ buffer }) {
  try {
    const rawBody = Buffer.from(buffer).toString('utf8');
    const parsed = await bourne.parse(rawBody, { protoAction: 'error' });
    return { parsed };
  } catch (error: any) {
    const res = {
      parsed: null,
      error: {
        message: error.message,
        status: error.status || 400,
        name: error.name,
      },
    };
    return res;
  }
}
