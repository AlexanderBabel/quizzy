import { createContext, useContext, useEffect, useReducer } from "react";
import useAuthenticatedSocket from "./useAuthenticatedSocket";
import { useSocketEvent } from "socket.io-react-hook";
import { useWakeLock } from "react-screen-wake-lock";
import { enqueueSnackbar } from "notistack";
import useWindowFocus from "use-window-focus";

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
  quizId: null,
  quizName: null,
  players: [],
  role: null,
};

function reducer(state, action) {
  const newState = { ...state };
  switch (action.type) {
    case LobbyActionType.JOIN_LOBBY:
      newState.role = action.role;
      newState.lobbyCode = action.lobbyCode;
      newState.quizId = action.quizId;
      newState.quizName = action.quizName;
      break;
    case LobbyActionType.LEAVE_LOBBY:
      newState.role = null;
      newState.lobbyCode = null;
      newState.quizId = null;
      newState.quizName = null;
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
  const [lobbyState, dispatch] = useReducer(reducer, initialState);
  const { socket } = useAuthenticatedSocket();
  const windowFocused = useWindowFocus();

  const { isSupported, request, release } = useWakeLock({
    onRequest: () => enqueueSnackbar("Screen Wake Lock: requested!"),
    onError: () => enqueueSnackbar("An error happened 💥"),
    onRelease: () => enqueueSnackbar("Screen Wake Lock: released!"),
  });

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

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    if (lobbyState.lobbyCode !== null) {
      request();
    } else {
      release();
    }
  }, [lobbyState.lobbyCode, windowFocused]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LobbyContext.Provider value={{ lobbyState, dispatch, getPlayers }}>
      {children}
    </LobbyContext.Provider>
  );
}
