import { useEffect, useRef, useState } from "react";
import useToken from "../useToken/useToken";
import { io } from "socket.io-client";
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
  const { lastMessage, sendMessage } = useSocketEvent(socket, "eventName");

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      console.log("Connected");
      socket.emit("joinLobby");
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("Disconnected");
      setIsConnected(false);
    }

    function onFooEvent(value) {
      setFooEvents((previous) => [...previous, value]);
    }

    const currentSocket = socket;

    console.log("currentSocket", currentSocket);
    currentSocket.on("connect", onConnect);
    currentSocket.on("disconnect", onDisconnect);
    currentSocket.on("foo", onFooEvent);
    currentSocket.on("exception", function (data) {
      console.log("event", data);
    });

    return () => {
      currentSocket.off("connect", onConnect);
      currentSocket.off("disconnect", onDisconnect);
      currentSocket.off("foo", onFooEvent);
      currentSocket.off("exception");
      currentSocket.disconnect();
    };
  }, [socket]);

  return (
    <div>
      <h1>SocketHandler</h1>
      <p>Connected: {isConnected ? "Yes" : "No"}</p>
      <p>Foo events: {fooEvents.join(", ")}</p>
    </div>
  );
}
