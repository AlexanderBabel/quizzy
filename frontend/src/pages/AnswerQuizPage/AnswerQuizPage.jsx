import "./AnswerQuizPage.css";
import background from "../../images/blob-scene-haikei-8.svg";
import React, { useEffect } from "react";
import AnswerQuizQuestion from "../../components/AnswerQuizQuestion/AnswerQuizQuestion";
import useLobby, { LobbyActionType } from "../../context/useLobby";
import { useBlocker, useNavigate, useParams } from "react-router-dom";
import useGame, { GameState } from "../../context/useGame";
import { useSocketEvent } from "socket.io-react-hook";
import useAuthenticatedSocket from "../../context/useAuthenticatedSocket";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { enqueueSnackbar } from "notistack";

export default function AnswerQuizPage() {
  const { lobbyState, dispatch } = useLobby();
  const { gameState } = useGame();
  const navigate = useNavigate();
  const { lobbyCode } = useParams();

  const svgStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "100vw",
    minWidth: "100vw",
    height: "100vh",
    margin: "0",
    overflow: "hidden",
  };

  const { socket } = useAuthenticatedSocket();
  const { sendMessage: leaveLobby } = useSocketEvent(socket, "lobby:leave");
  const blocker = useBlocker(
    ({ nextLocation }) =>
      nextLocation.pathname !== "/game/stats" &&
      !(
        lobbyCode &&
        !lobbyState.lobbyCode &&
        nextLocation.pathname.startsWith("/join")
      ) &&
      !(!lobbyCode && !lobbyState.lobbyCode && nextLocation.pathname === "/")
  );

  useEffect(() => {
    if (gameState.state === GameState.RESULTS) {
      navigate("/game/stats");
    }
  }, [gameState.state]); // eslint-disable-line react-hooks/exhaustive-deps

  if (lobbyCode && !lobbyState.lobbyCode) {
    navigate(`/join/${lobbyCode}`);
    return (
      <div className="answerQuizPage" style={svgStyle}>
        Joining lobby
      </div>
    );
  }

  if (!lobbyCode && !lobbyState.lobbyCode) {
    navigate("/");
    return (
      <div className="answerQuizPage" style={svgStyle}>
        Not in a lobby
      </div>
    );
  }

  return (
    <div className="answerQuizPage" style={svgStyle}>
      <AnswerQuizQuestion />
      <Dialog
        open={blocker.state === "blocked"}
        onClose={() => blocker.reset()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to leave the current Game?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => blocker.reset()}>Stay</Button>
          <Button
            onClick={() => {
              leaveLobby();
              dispatch({ type: LobbyActionType.LEAVE_LOBBY });
              enqueueSnackbar("Game left!", { variant: "info" });
              blocker.proceed();
            }}
            autoFocus
          >
            Leave
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
