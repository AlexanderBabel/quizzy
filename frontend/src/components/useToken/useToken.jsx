import useAxios from "axios-hooks";
import { getTokenFromLocalStorage, isGuestToken } from "../axios";
import { useReducer, useContext, createContext, useEffect } from "react";

const TokenContext = createContext({});

const Type = {
  Guest: "guest",
  Creator: "creator",
  Logout: "logout",
};

function reducer(_state, action) {
  if (action.type === Type.Guest) {
    localStorage.setItem("guestToken", action.token);
    const isGuest = isGuestToken(action.token);
    return {
      token: action.token,
      isGuest,
      isCreator: !isGuest,
    };
  } else if (action.type === Type.Creator) {
    localStorage.setItem("token", action.token);
    const isGuest = isGuestToken(action.token);
    return {
      token: action.token,
      isGuest,
      isCreator: !isGuest,
    };
  } else if (action.type === Type.Logout) {
    localStorage.removeItem("token");
    return getTokenFromLocalStorage("guestToken");
  }
  throw Error("Unknown action.");
}

export function TokenProvider({ children }) {
  const [{ data }, refetch] = useAxios(
    { method: "POST", url: "/auth/guest" },
    { manual: true }
  );

  const [state, dispatch] = useReducer(
    reducer,
    { token: null, isGuest: false, isCreator: false },
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
    if (state.token === null) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  useEffect(() => {
    if (data?.accessToken) {
      dispatch({ type: Type.Guest, token: data.accessToken });
    }
  }, [data]);

  const saveToken = (token) => {
    if (token === null) {
      dispatch({ type: Type.Logout });
      return;
    }

    dispatch({ type: Type.Creator, token: token });
  };

  return (
    <TokenContext.Provider
      value={{
        setToken: saveToken,
        token: state.token,
        isGuest: state.isGuest,
        isCreator: state.isCreator,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}

export default function useToken() {
  return useContext(TokenContext);
}
