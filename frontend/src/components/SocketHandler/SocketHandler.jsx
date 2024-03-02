import { useEffect, useReducer } from "react";
import { useSocketEvent } from "socket.io-react-hook";
import { decodeToken, isExpired } from "react-jwt";
import useToken from "../../context/useToken";
import useAuthenticatedSocket from "../../context/useAuthenticatedSocket";
import useAxios from "axios-hooks";
import { enqueueSnackbar } from "notistack";

export const Role = {
  HOST: "host",
  PLAYER: "player",
};

export const Type = {
  ADD_TOKEN: "ADD_TOKEN",
  CHANGE_TOKEN: "CHANGE_TOKEN",
  UPDATE_CONNECTED: "UPDATE_CONNECTED",
  UPDATE_ROLE: "UPDATE_ROLE",
  UPDATE_LOBBY_CODE: "UPDATE_LOBBY_CODE",
};

export const initialState = {
  tokens: [],
  currentIndex: 0,
  isConnected: false,
  role: "lobby",
  lobbyCode: "",
};

export function reducer(state, action) {
  const newState = { ...state };
  switch (action.type) {
    case Type.ADD_TOKEN:
      newState.tokens = [
        ...newState.tokens.filter(
          (token) => token.userName !== action.userName
        ),
        { userName: action.userName, token: action.token },
      ];
      newState.currentIndex = newState.tokens.length - 1;
      break;
    case Type.CHANGE_TOKEN:
      newState.currentIndex = action.index;
      break;
    case Type.UPDATE_CONNECTED:
      newState.isConnected = action.isConnected;
      break;
    case Type.UPDATE_ROLE:
      newState.role = action.role;
      break;
    case Type.UPDATE_LOBBY_CODE:
      newState.lobbyCode = action.lobbyCode;
      break;
    default:
      break;
  }

  localStorage.setItem("socketTester", JSON.stringify(newState));
  return newState;
}

export default function SocketHandler() {
  const { token, isCreator, setToken } = useToken();
  const { socket } = useAuthenticatedSocket();
  const [{ data, error }, login] = useAxios(
    { url: "/auth/guest", method: "post" },
    { manual: true }
  );

  const { lastMessage: lobbyMessage, sendMessage: sendLobbyMessage } =
    useSocketEvent(socket, "lobby:create");
  const {
    lastMessage: joinLobbyMessage, // eslint-disable-line
    sendMessage: sendJoinLobbyMessage,
  } = useSocketEvent(socket, "lobby:join");
  const { lastMessage: players } = useSocketEvent(socket, "lobby:players");
  const { sendMessage: startQuiz } = useSocketEvent(socket, "lobby:start");
  const { lastMessage: gameStart } = useSocketEvent(socket, "lobby:startQuiz"); // eslint-disable-line
  const { lastMessage: question } = useSocketEvent(socket, "game:question");
  const { sendMessage: sendAnswer } = useSocketEvent(socket, "game:answer");
  const { lastMessage: results } = useSocketEvent(socket, "game:results");
  const { sendMessage: sendNextQuestion } = useSocketEvent(
    socket,
    "game:nextQuestion"
  );

  const [state, dispatch] = useReducer(reducer, initialState, () => {
    const localState = localStorage.getItem("socketTester");
    const newState = localState ? JSON.parse(localState) : initialState;
    if (newState.tokens) {
      newState.tokens = newState.tokens.filter((t) => !isExpired(t.token));
    }
    newState.currentIndex = Math.min(
      newState.currentIndex,
      newState.tokens.length - 1
    );

    newState.isConnected = socket.connected;
    return newState;
  });

  useEffect(() => {
    function onConnect() {
      console.log("Connected");
      dispatch({ type: Type.UPDATE_CONNECTED, isConnected: true });
    }

    function onDisconnect() {
      console.log("Disconnected");
      dispatch({ type: Type.UPDATE_CONNECTED, isConnected: false });
    }

    const currentSocket = socket;
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

  useEffect(() => {
    if (isCreator && state.tokens.findIndex((t) => t.token === token) === -1) {
      dispatch({
        type: Type.ADD_TOKEN,
        userName: "Creator",
        token,
      });
    }
  }, [isCreator, token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (state.currentIndex >= 0 && state.currentIndex < state.tokens.length) {
      setToken(state.tokens[state.currentIndex].token);
    }
  }, [state.currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data?.accessToken) {
      dispatch({
        type: Type.ADD_TOKEN,
        userName: `Guest Player ${Object.keys(state.tokens).length + 1}`,
        token: data.accessToken,
      });
      enqueueSnackbar("Guest token created", { variant: "success" });
    } else if (error) {
      enqueueSnackbar(`Failed to create guest token. Error: ${error.message}`, {
        variant: "error",
      });
      console.log("error", error);
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const payload = decodeToken(token) || {};

  return (
    <div className="cardContainer">
      <div className="cardStartPageWrapper" style={{ height: "500px" }}>
        <p>Select User</p>
        <select
          onChange={(e) =>
            dispatch({
              type: Type.CHANGE_TOKEN,
              index: e.target.value,
            })
          }
          value={state.currentIndex}
        >
          {state.tokens.map(({ userName, token }, index) => {
            const payload = decodeToken(token);
            return (
              <option key={index} value={index}>
                {userName} ({isExpired(token) ? "Expired" : "Valid"}) (
                {payload?.type})
              </option>
            );
          })}
        </select>

        <button onClick={() => login()}>Generate Guest Token</button>
        <p>
          Current User:
          <br />
          Name: {state?.tokens[state.currentIndex]?.userName}
          <br />
          Type: {payload?.type}
          <br />
          ID: {payload?.id}
        </p>

        <p>
          Websocket Status: {state.isConnected ? "Connected" : "Disconnected"}
        </p>
      </div>
      <div className="cardStartPageWrapper" style={{ height: "500px" }}>
        <p>Lobby</p>
        {question && <p>Game in progress</p>}
        <div>
          {!question && !players && (
            <div>
              {lobbyMessage && <p>Lobby Code: {lobbyMessage}</p>}
              {!lobbyMessage && (
                <div>
                  <button
                    onClick={() => {
                      dispatch({ type: Type.UPDATE_ROLE, role: "host" });
                      sendLobbyMessage(1);
                    }}
                  >
                    Create Lobby
                  </button>
                  <br />
                  <br />
                  <input
                    type="text"
                    value={state.lobbyCode}
                    onChange={(e) =>
                      dispatch({
                        type: Type.UPDATE_LOBBY_CODE,
                        lobbyCode: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={() => {
                      dispatch({ type: Type.UPDATE_ROLE, role: "player" });
                      sendJoinLobbyMessage({
                        lobbyCode: state.lobbyCode,
                        userName: state.tokens[state.currentIndex].userName,
                      });
                    }}
                  >
                    Join Lobby
                  </button>
                </div>
              )}
            </div>
          )}
          {players && (
            <div>
              <p>Players: {JSON.stringify(players)}</p>
              <p>Role: {state.role}</p>
              {state.role === Role.HOST && !question && (
                <button
                  onClick={() => {
                    startQuiz();
                  }}
                >
                  Start Quiz
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div
        className="cardStartPageWrapper"
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
            {state.role === Role.PLAYER &&
              question.answers.map((answer) => (
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
            {state.role === Role.HOST && (
              <button onClick={() => sendNextQuestion()}>Next Question</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
