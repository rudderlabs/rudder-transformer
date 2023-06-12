// base notion API endpoint
const BASE_URL = 'https://api.notion.com/v1';

// notion API endpoints
const ENDPOINTS = {
  DATABASES: `${BASE_URL}/databases`,
  PAGES: `${BASE_URL}/pages`,
  BLOCKS: `${BASE_URL}/blocks`,
};

export { BASE_URL, ENDPOINTS };
