import { useEffect, useState } from "react";
import useToken from "../useToken/useToken";
import { useSocket, useSocketEvent } from "socket.io-react-hook";

const URL =
  process.env.NODE_ENV === "production" ? undefined : "ws://127.0.0.1:3001";

export const useAuthenticatedSocket = () => {
  const { token } = useToken();
  return useSocket(URL, {
    enabled: !!token,
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default function SocketHandler() {
  const { socket, connected, error } = useAuthenticatedSocket();
  const { lastMessage: lobbyMessage, sendMessage: sendLobbyMessage } =
    useSocketEvent(socket, "lobby:create");

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      console.log("Connected");
      socket.emit("lobby:create", "1");
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("Disconnected");
      setIsConnected(false);
    }

    const currentSocket = socket;

    console.log("currentSocket", currentSocket);
    currentSocket.on("connect", onConnect);
    currentSocket.on("disconnect", onDisconnect);
    currentSocket.on("exception", function (data) {
      console.log("event", data);
    });

    return () => {
      currentSocket.off("connect", onConnect);
      currentSocket.off("disconnect", onDisconnect);
      currentSocket.off("exception");
      currentSocket.disconnect();
    };
  }, [socket]);

  return (
    <div>
      <h1>SocketHandler</h1>
      <p>Connected: {isConnected ? "Yes" : "No"}</p>
      <button onClick={() => sendLobbyMessage(1)}>Create Lobby</button>
      <p>Last message: {lobbyMessage}</p>
    </div>
  );
}
