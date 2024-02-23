import { useEffect, useState } from "react";
import useToken from "../useToken/useToken";
import { useSocket, useSocketEvent } from "socket.io-react-hook";
import { decodeToken, isExpired } from "react-jwt";

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
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [tokens, setTokens] = useState(
    JSON.parse(localStorage.getItem("tokens") || "{}")
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
    <div className="cardContainer">
      <div className="cardStartpageWrapper" style={{ height: "500px" }}>
        <p>Select User</p>
        <select
          onChange={(e) => {
            const id = e.target.value;
            setUserName(id);
            setToken(tokens[id]);
            localStorage.setItem("userName", id);
          }}
          value={userName}
        >
          {Object.keys(tokens).map((localName) => {
            const token = tokens[localName];
            const payload = decodeToken(token);
            return (
              <option key={localName} value={localName}>
                {localName} ({isExpired(token) ? "Expired" : "Valid"}) (
                {payload?.type})
              </option>
            );
          })}
        </select>

        <button
          onClick={() => {
            fetch(`${process.env.REACT_APP_API_ENDPOINT}/v1/auth/guest`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((res) => res.json())
              .then((data) => {
                console.log("data", data);
                const localName = `Guest Player ${Object.keys(tokens).length}`;
                tokens[localName] = data.accessToken;
                setTokens(Object.assign({}, tokens));
                localStorage.setItem("tokens", JSON.stringify(tokens));
                localStorage.setItem("userName", localName);
                setUserName(localName);
                setToken(data.accessToken);
              });
          }}
        >
          Generate Guest Token
        </button>

        <p>
          Current User:
          <br />
          Name: {userName}
          <br />
          Type: {payload?.type}
          <br />
          ID: {payload?.id}
        </p>

        <p>Websocket Status: {isConnected ? "Connected" : "Disconnected"}</p>
      </div>
      <div className="cardStartpageWrapper" style={{ height: "500px" }}>
        <p>Lobby</p>
        {question && <p>Game in progress</p>}
        {!question && (
          <div>
            {!players && (
              <div>
                <button onClick={() => sendLobbyMessage(1)}>
                  Create Lobby
                </button>
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
      </div>
      <div
        className="cardStartpageWrapper"
        style={{ height: "500px", width: "500px" }}
      >
        <p>Game</p>
        {!question && <p>Waiting for Lobby to start...</p>}
        {question && (
          <div>
            <small style={{ color: "white" }}>
              Question: {JSON.stringify(question)}
            </small>
            <h2 style={{ color: "white" }}>{question.question}</h2>
            {question.answers.map((answer) => (
              <button onClick={() => sendAnswer(answer.id)}>
                {answer.text}
              </button>
            ))}
            <br />
            <br />
            <small style={{ color: "white" }}>
              Results: {JSON.stringify(results)}
            </small>
            <br />
            <br />
            <button onClick={() => sendNextQuestion()}>Next Question</button>
          </div>
        )}
      </div>
    </div>
  );
}
