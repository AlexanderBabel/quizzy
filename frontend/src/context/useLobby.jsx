import { createContext, useContext, useEffect, useReducer } from "react";
import useAuthenticatedSocket from "./useAuthenticatedSocket";
import { useSocketEvent } from "socket.io-react-hook";

const LobbyContext = createContext({});

export default function useLobby() {
  return useContext(LobbyContext);
}

export const LobbyActionType = {
  JOIN_LOBBY: "JOIN_LOBBY",
  LEAVE_LOBBY: "LEAVE_LOBBY",
  UPDATE_PLAYERS: "UPDATE_PLAYERS",
};

export const GameRole = {
  HOST: "host",
  PLAYER: "player",
};

export const initialState = {
  lobbyCode: null,
  players: [],
  role: null,
};

function reducer(state, action) {
  const newState = { ...state };
  switch (action.type) {
    case LobbyActionType.JOIN_LOBBY:
      newState.role = action.role;
      newState.lobbyCode = action.lobbyCode;
      break;
    case LobbyActionType.LEAVE_LOBBY:
      newState.role = null;
      newState.lobbyCode = null;
      newState.players = [];
      break;
    case LobbyActionType.UPDATE_PLAYERS:
      if (newState.role === null) {
        newState.role = GameRole.PLAYER;
      }
      newState.players = action.players;
      break;
    default:
      break;
  }
  return newState;
}

export function LobbyProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { socket } = useAuthenticatedSocket();

  // Save players in state when an update happens
  const { lastMessage: players, sendMessage: getPlayers } = useSocketEvent(
    socket,
    "lobby:players"
  );
  useEffect(() => {
    if (players) {
      dispatch({ type: LobbyActionType.UPDATE_PLAYERS, players });
    }
  }, [players]);

  return (
    <LobbyContext.Provider value={{ state, dispatch, getPlayers }}>
      {children}
    </LobbyContext.Provider>
  );
}
