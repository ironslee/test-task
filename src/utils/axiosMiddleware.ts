import axios from "axios";

const api = axios;

const proxyUrl = "https://cors-anywhere.herokuapp.com/";

const backendUrl = "https://hcateringback-dev.unitbeandev.com";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
api.interceptors.request.use((config: any) => {
  const tokens = window.localStorage.getItem("tokens");
  const tokensParse = tokens ? JSON.parse(tokens) : "";

  const { access_token } = tokensParse;

  if (access_token) {
    config.headers.authorization = `${access_token}`;
  }

  // config.url = new URL(
  //   config.url,
  //   "https://hcateringback-dev.unitbeandev.com"
  // ).toString();

  config.url = new URL(config.url, `${proxyUrl}${backendUrl}`).toString();

  return config;
});

export default api;
