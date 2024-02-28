import { createContext, useContext } from "react";
import { useSocket } from "socket.io-react-hook";
import useToken from "./useToken";

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

  return (
    <SocketContext.Provider value={state}>{children}</SocketContext.Provider>
  );
}
