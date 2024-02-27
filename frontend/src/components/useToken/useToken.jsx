import { useEffect, useReducer } from "react";
import { decodeToken, isExpired } from "react-jwt";

const Type = {
  Guest: "guest",
  Creator: "creator",
  Logout: "logout",
};

function reducer(state, action) {
  if (action.type === Type.Guest) {
    localStorage.setItem("guestToken", action.token);
    return {
      token: action.token,
      isGuest: isGuestToken(action.token),
    };
  } else if (action.type === Type.Creator) {
    localStorage.setItem("token", action.token);
    return {
      token: action.token,
      isGuest: isGuestToken(action.token),
    };
  } else if (action.type === Type.Logout) {
    localStorage.removeItem("token");
    return getTokenFromLocalStorage("guestToken");
  }
  throw Error("Unknown action.");
}

function generateGuestToken(dispatch) {
  fetch(`${process.env.REACT_APP_API_ENDPOINT}/v1/auth/guest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      dispatch({ type: Type.Guest, token: data.accessToken });
    });
}

function getTokenFromLocalStorage(name = "token") {
  const token = localStorage.getItem(name);
  if (token === null) {
    return {
      token: null,
      isGuest: false,
    };
  }

  if (isExpired(token)) {
    localStorage.removeItem(name);
    return {
      token: null,
      isGuest: false,
    };
  }

  return {
    token: token,
    isGuest: isGuestToken(token),
  };
}

function isGuestToken(token) {
  const payload = decodeToken(token);
  return payload?.type === Type.Guest;
}

export default function useToken() {
  const [state, dispatch] = useReducer(
    reducer,
    { token: null, isGuest: false },
    () => {
      const creatorToken = getTokenFromLocalStorage("token");
      if (creatorToken.token !== null) {
        return creatorToken;
      }

      const guestToken = getTokenFromLocalStorage("guestToken");
      if (guestToken.token !== null) {
        return guestToken;
      }

      return {
        token: null,
        isGuest: false,
      };
    }
  );

  useEffect(() => {
    if (state.token !== null) {
      return;
    }
    generateGuestToken(dispatch);
  }, [state.token]);

  const saveToken = (token) => {
    if (token === null) {
      dispatch({ type: Type.Logout });
      return;
    }

    dispatch({ type: Type.Creator, token: token });
  };

  return {
    setToken: saveToken,
    token: state.token,
    isGuest: state.isGuest,
  };
}
