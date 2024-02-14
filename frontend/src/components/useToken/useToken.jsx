import { useState } from "react";

export default function useToken() {
  const getToken = () => {
    const token = localStorage.getItem("token");
    return token;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (token) => {
    if (token === null) {
      localStorage.removeItem("token");
      setToken(null);
      return;
    }

    localStorage.setItem("token", token);
    setToken(token);
  };

  return {
    setToken: saveToken,
    token,
  };
}
