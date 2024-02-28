import { createContext, useContext, useEffect } from "react";
import { useSocket } from "socket.io-react-hook";
import useToken from "./useToken";
import { enqueueSnackbar } from "notistack";

// parse REACT_APP_API_ENDPOINT and convert to ws or wss endpoint
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
const wsEndpoint = apiEndpoint.replace(/^http/, "ws");
const SocketContext = createContext({});

export default function useAuthenticatedSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const { token } = useToken();
  const state = useSocket(wsEndpoint, {
    enabled: !!token,
    transports: ["websocket"],
    auth: {
      token,
    },
  });

  useEffect(() => {
    state.socket.on("exception", function (data) {
      console.log("event", data);
      enqueueSnackbar(`Error from server: ${data}`, { variant: "error" });
    });

    return () => {
      state.socket.off("exception");
      state.socket.disconnect();
    };
  }, [state.socket]);

  return (
    <SocketContext.Provider value={state}>{children}</SocketContext.Provider>
  );
}
