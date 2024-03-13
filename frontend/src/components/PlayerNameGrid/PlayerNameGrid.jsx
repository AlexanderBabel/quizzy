import "./PlayerNameGrid.css";
import { useSocketEvent } from "socket.io-react-hook";
import useAuthenticatedSocket from "../../context/useAuthenticatedSocket";
import useLobby, { GameRole } from "../../context/useLobby";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import React from "react";

export default function PlayerNameGrid() {
  const { socket } = useAuthenticatedSocket();
  const { sendMessage: kick } = useSocketEvent(socket, "lobby:kick");
  const { lobbyState } = useLobby();

  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip
      {...props}
      arrow
      classes={{ popper: className }}
      disableHoverListener={lobbyState.role !== GameRole.HOST}
      disableFocusListener={lobbyState.role !== GameRole.HOST}
      disableTouchListener={lobbyState.role !== GameRole.HOST}
    />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "#e74c3c",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#e74c3c",
    },
  }));

  return (
    <div id="PlayerNameGrid">
      {lobbyState.players.map(({ id, name }) => (
        <BootstrapTooltip
          key={id}
          title={
            <div
              onClick={() => kick({ playerId: id, block: false })}
              className="kickButton"
            >
              Kick Player
            </div>
          }
        >
          <div className="playerEntry">
            <div key={id} className="playerName">
              {name}
            </div>
          </div>
        </BootstrapTooltip>
      ))}
    </div>
  );
}
