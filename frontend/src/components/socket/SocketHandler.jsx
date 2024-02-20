import { useEffect, useState } from "react";
import useToken from "../useToken/useToken";
import { useSocket, useSocketEvent } from "socket.io-react-hook";
import { decodeToken } from "react-jwt";

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
  const { token, setToken } = useToken();
  const { socket, connected, error } = useAuthenticatedSocket();
  const { lastMessage: lobbyMessage, sendMessage: sendLobbyMessage } =
    useSocketEvent(socket, "lobby:create");
  const { lastMessage: joinLobbyMessage, sendMessage: sendJoinLobbyMessage } =
    useSocketEvent(socket, "lobby:join");
  const { lastMessage: players } = useSocketEvent(socket, "lobby:players");

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lobbyCode, setLobbyCode] = useState("");

  useEffect(() => {
    function onConnect() {
      console.log("Connected");
      // socket.emit("lobby:create", "1");
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

  const payload = decodeToken(token) || {};

  return (
    <div>
      <h1>SocketHandler</h1>
      <button
        onClick={() => {
          fetch("http://localhost:3001/v1/auth/guest", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              setToken(data.accessToken);
            });
        }}
      >
        Connect
      </button>
      <p>
        User: {payload.type} {payload?.id}
      </p>
      <p>Connected: {isConnected ? "Yes" : "No"}</p>
      <button onClick={() => sendLobbyMessage(1)}>Create Lobby</button>
      <p>Create Response: {lobbyMessage}</p>
      <input
        type="text"
        value={lobbyCode}
        onChange={(e) => setLobbyCode(e.target.value)}
      />
      <button
        onClick={() =>
          sendJoinLobbyMessage({ lobbyCode, userName: "Player 1" })
        }
      >
        Join Lobby
      </button>
      <p>Join Response: {joinLobbyMessage}</p>
      <p>Players: {JSON.stringify(players)}</p>
    </div>
  );
}
