import { useEffect, useState } from "react";
import useToken from "../useToken/useToken";
import { useSocket, useSocketEvent } from "socket.io-react-hook";
import { decodeToken } from "react-jwt";

const URL =
  process.env.NODE_ENV === "production" ? undefined : "ws://127.0.0.1:3001";

export const useAuthenticatedSocket = (token) => {
  return useSocket(URL, {
    enabled: !!token,
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const identities = {
  creator: {
    userName: "Creator Account",
    tokenName: "creator",
  },
  guest1: {
    userName: "Player 1",
    tokenName: "guest1",
  },
  guest2: {
    userName: "Player 2",
    tokenName: "guest2",
  },
};

export default function SocketHandler() {
  const { token, setToken } = useToken();
  const { socket } = useAuthenticatedSocket(token);
  const { lastMessage: lobbyMessage, sendMessage: sendLobbyMessage } =
    useSocketEvent(socket, "lobby:create");
  const { lastMessage: joinLobbyMessage, sendMessage: sendJoinLobbyMessage } =
    useSocketEvent(socket, "lobby:join");
  const { lastMessage: players } = useSocketEvent(socket, "lobby:players");
  const { sendMessage: startQuiz } = useSocketEvent(socket, "lobby:start");
  const { lastMessage: gameStart } = useSocketEvent(socket, "lobby:startQuiz");
  const { lastMessage: question } = useSocketEvent(socket, "game:question");
  const { sendMessage: sendAnswer } = useSocketEvent(socket, "game:answer");
  const { lastMessage: results } = useSocketEvent(socket, "game:results");
  const { sendMessage: sendNextQuestion } = useSocketEvent(
    socket,
    "game:nextQuestion"
  );

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lobbyCode, setLobbyCode] = useState("");
  const defaultIdentity =
    token === localStorage.getItem("creator")
      ? "creator"
      : token === localStorage.getItem("guest1")
      ? "guest1"
      : "guest2";
  const [userName, setUserName] = useState(
    identities[defaultIdentity].userName
  );

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
    <div className='cardStartpageWrapper' style={{height: '500px'}}>
      <p>SocketHandler</p>
      {/* <button
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
      </button> */}
      <p>
        User: {payload.type} {payload?.id}
      </p>
      <select
        onChange={(e) => {
          const id = e.target.value;
          setUserName(identities[id].userName);
          setToken(localStorage.getItem(identities[id].tokenName));
        }}
        value={defaultIdentity}
      >
        <option value="creator">Creator Account</option>
        <option value="guest1">Player 1</option>
        <option value="guest2">Player 2</option>
      </select>
      <p>Connected: {isConnected ? "Yes" : "No"}</p>
      {!question && (
        <div>
          {!players && (
            <div>
              <button onClick={() => sendLobbyMessage(1)}>Create Lobby</button>
              <p>Create Response: {lobbyMessage}</p>
              <input
                type="text"
                value={lobbyCode}
                onChange={(e) => setLobbyCode(e.target.value)}
              />
              <button
                onClick={() => sendJoinLobbyMessage({ lobbyCode, userName })}
              >
                Join Lobby
              </button>
            </div>
          )}
          {players && (
            <div>
              <p>Join Response: {joinLobbyMessage}</p>
              <p>Players: {JSON.stringify(players)}</p>
              <p>Game Start: {JSON.stringify(gameStart)}</p>
              <button
                onClick={() => {
                  startQuiz();
                }}
              >
                Start Quiz
              </button>
            </div>
          )}
        </div>
      )}
      {question && (
        <div>
          <p>Question: {JSON.stringify(question)}</p>
          <h2>{question.question}</h2>
          {question.answers.map((answer) => (
            <button onClick={() => sendAnswer(answer.id)}>{answer.text}</button>
          ))}
          <p>Results: {JSON.stringify(results)}</p>
          <button onClick={() => sendNextQuestion()}>Next Question</button>
        </div>
      )}
    </div>
  );
}
