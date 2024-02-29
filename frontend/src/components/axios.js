import Axios from "axios";
import { configure } from 'axios-hooks'
import { decodeToken, isExpired } from "react-jwt";

const axios = Axios.create({
  baseURL: `${process.env.REACT_APP_API_ENDPOINT}/v1/`,
});

// request interceptor to add token to request headers
axios.interceptors.request.use(
  async (config) => {
    const { token } = getTokenFromLocalStorage("token");
    const { token: guestToken } = getTokenFromLocalStorage("guestToken");

    if (token ?? guestToken) {
      config.headers = {
        authorization: `Bearer ${token ?? guestToken}`
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

configure({ axios });

export function getTokenFromLocalStorage(name = "token") {
  const token = localStorage.getItem(name);
  if (token === null) {
    return {
      token: null,
      isGuest: false,
      isCreator: false,
    };
  }

  if (isExpired(token)) {
    localStorage.removeItem(name);
    return {
      token: null,
      isGuest: false,
      isCreator: false,
    };
  }

  const isGuest = isGuestToken(token);
  return {
    token: token,
    isGuest,
    isCreator: !isGuest,
  };
}

export function isGuestToken(token) {
  const payload = decodeToken(token);
  return payload?.type === 'guest';
}
