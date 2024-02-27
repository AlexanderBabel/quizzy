import { createContext, useContext } from "react";
import { useSocket } from "socket.io-react-hook";

// parse REACT_APP_API_ENDPOINT and convert to ws or wss endpoint
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;
const wsEndpoint = apiEndpoint.replace(/^http/, "ws");
const SocketContext = createContext({});

export default function useAuthenticatedSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children, token }) {
  const state = useSocket(wsEndpoint, {
    enabled: !!token,
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return (
    <SocketContext.Provider value={state}>{children}</SocketContext.Provider>
  );
}
