import { createContext, useContext, useEffect, useReducer } from "react";
import useAuthenticatedSocket from "./useAuthenticatedSocket";
import { useSocketEvent } from "socket.io-react-hook";
import useLobby from "./useLobby";

const GameContext = createContext({});

export default function useGame() {
  return useContext(GameContext);
}

export const GameActionType = {
  UPDATE_QUESTION: "UPDATE_QUESTION",
  UPDATE_RESULTS: "UPDATE_RESULTS",
  DELETE_DATA: "DELETE_DATA",
  END_GAME: "END_GAME",
};

export const GameState = {
  QUESTION: "QUESTION",
  WAITING: "WAITING",
  RESULTS: "RESULTS",
  END_GAME: "END_GAME",
};

export const initialState = {
  question: null,
  results: null,
  state: GameState.WAITING,
};

function reducer(state, action) {
  const newState = { ...state };
  switch (action.type) {
    case GameActionType.UPDATE_QUESTION:
      newState.question = action.question;
      newState.results = null;
      newState.state = GameState.QUESTION;
      break;
    case GameActionType.UPDATE_RESULTS:
      newState.results = action.results;
      newState.state = GameState.RESULTS;
      break;
    case GameActionType.DELETE_DATA:
      newState.question = null;
      newState.results = null;
      newState.state = GameState.WAITING;
      break;
    case GameActionType.END_GAME:
      newState.state = GameState.END_GAME;
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
      dispatch({ type: GameActionType.UPDATE_QUESTION, question });
    }
  }, [question]);

  const { lastMessage: results } = useSocketEvent(socket, "game:results");
  useEffect(() => {
    if (results) {
      dispatch({ type: GameActionType.UPDATE_RESULTS, results });
    }
  }, [results]);

  useEffect(() => {
    if (lobbyState.lobbyCode === null) {
      dispatch({ type: GameActionType.DELETE_DATA });
    }
  }, [lobbyState.lobbyCode]);

  const { lastMessage: endGame } = useSocketEvent(socket, "game:end");
  useEffect(() => {
    if (endGame?.ended) {
      dispatch({ type: GameActionType.END_GAME });
    }
  }, [endGame]);

  return (
    <GameContext.Provider value={{ gameState }}>
      {children}
    </GameContext.Provider>
  );
}
