import { createContext, useContext, useEffect, useReducer } from "react";
import useAuthenticatedSocket from "./useAuthenticatedSocket";
import { useSocketEvent } from "socket.io-react-hook";
import useLobby from "./useLobby";

const GameContext = createContext({});

export default function useGame() {
  return useContext(GameContext);
}

export const LobbyActionType = {
  UPDATE_QUESTION: "UPDATE_QUESTION",
  UPDATE_RESULTS: "UPDATE_RESULTS",
  DELETE_DATA: "DELETE_DATA",
};

export const GameState = {
  QUESTION: "QUESTION",
  WAITING: "WAITING",
  RESULTS: "RESULTS",
};

export const initialState = {
  question: null,
  results: null,
  state: GameState.WAITING,
};

function reducer(state, action) {
  const newState = { ...state };
  switch (action.type) {
    case LobbyActionType.UPDATE_QUESTION:
      newState.question = action.question;
      newState.results = null;
      break;
    case LobbyActionType.UPDATE_RESULTS:
      newState.results = action.results;
      break;
    case LobbyActionType.DELETE_DATA:
      newState.question = null;
      newState.results = null;
      break;
    default:
      break;
  }
  return newState;
}

export function GameProvider({ children }) {
  const [gameState, dispatch] = useReducer(reducer, initialState);
  const { lobbyState } = useLobby();
  const { socket } = useAuthenticatedSocket();

  const { lastMessage: question } = useSocketEvent(socket, "game:question");
  useEffect(() => {
    if (question) {
      dispatch({ type: LobbyActionType.UPDATE_QUESTION, question });
    }
  }, [question]);

  const { lastMessage: results } = useSocketEvent(socket, "game:results");
  useEffect(() => {
    if (results) {
      dispatch({ type: LobbyActionType.UPDATE_RESULTS, results });
    }
  }, [results]);

  useEffect(() => {
    if (lobbyState.lobbyCode === null) {
      dispatch({ type: LobbyActionType.DELETE_DATA });
    }
  }, [lobbyState.lobbyCode]);

  return (
    <GameContext.Provider value={{ gameState }}>
      {children}
    </GameContext.Provider>
  );
}
