import { createContext, useContext, useEffect, useReducer } from "react";
import useAuthenticatedSocket from "./useAuthenticatedSocket";
import { useSocketEvent } from "socket.io-react-hook";

const GameContext = createContext({});

export default function useGame() {
  return useContext(GameContext);
}

export const LobbyActionType = {
  UPDATE_QUESTION: "UPDATE_QUESTION",
  UPDATE_RESULTS: "UPDATE_RESULTS",
};

// type Question = {
//   question: string,
//   answers: { id: Number, text: String }[],
//   count: number,
//   current: number,
//   endTime: Date,
// };

export const GameState = {
  QUESTION: "QUESTION",
  WAITING: "WAITING",
  RESULTS: "RESULTS",
};

export const initialState = {
  question: null,
  results: [],
  state: GameState.WAITING,
};

function reducer(state, action) {
  const newState = { ...state };
  switch (action.type) {
    case LobbyActionType.UPDATE_QUESTION:
      newState.question = action.question;
      break;
    case LobbyActionType.UPDATE_RESULTS:
      newState.results = action.results;
      break;
    default:
      break;
  }
  return newState;
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
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

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
