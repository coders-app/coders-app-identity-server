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
