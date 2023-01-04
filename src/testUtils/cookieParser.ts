// 'coders_identity_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQmVuamFtaW4gQnJla2tlIiwiaXNBZG1pbiI6ZmFsc2UsImlkIjoiNjNiNTYxNTNlZGMxNDE5NDgxYjQ5MmUyIiwiaWF0IjoxNjcyODMxMzE2LCJleHAiOjE2NzMwMDQxMTZ9.IL2o59b8K0PUFRE0M08lQsQjK-piHI1W7EG9GYJnohY; Max-Age=86400; Path=/; Expires=Thu, 05 Jan 2023 11:21:56 GMT; HttpOnly'

const cookieParser = (cookie: string): Record<string, string | boolean> => {
  const keyValuePairs = cookie.split("; ");

  const splitKeyValuePairs = keyValuePairs.map((pair) => pair.split("="));

  const cookieObject: Record<string, string | boolean> = {};

  for (const [key, value] of splitKeyValuePairs) {
    cookieObject[key] = value ?? true;
  }

  return cookieObject;
};

export default cookieParser;
