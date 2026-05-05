const readEnv = (...values: Array<string | undefined>) => {
  const value = values.find((item) => item && item !== "undefined");
  return value ?? "";
};

const configs = {
  APP_ENV: readEnv(process.env.NEXT_PUBLIC_APP_ENV, process.env.REACT_APP_ENV),
  API_DOMAIN:
    readEnv(process.env.NEXT_PUBLIC_API_BASE_URL, process.env.REACT_APP_API_DOMAIN) ||
    "http://localhost:3001",
  AWS_DOMAIN: readEnv(process.env.NEXT_PUBLIC_AWS_DOMAIN, process.env.REACT_APP_AWS_DOMAIN),
};

export default configs;
