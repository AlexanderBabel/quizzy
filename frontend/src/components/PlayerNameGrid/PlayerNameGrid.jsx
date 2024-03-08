import "./PlayerNameGrid.css";
import { useSocketEvent } from "socket.io-react-hook";
import useAuthenticatedSocket from "../../context/useAuthenticatedSocket";
import useLobby, { GameRole } from "../../context/useLobby";

export default function PlayerNameGrid({ players }) {
  const { socket } = useAuthenticatedSocket();
  const { sendMessage: kick } = useSocketEvent(socket, "lobby:kick");
  const { lobbyState } = useLobby();


  return (
    <div id="PlayerNameGrid">
      {lobbyState.players.map(({ id, name }) => (
        <div key={id} className="playerEntry">
            <div class="playerIcon"></div>
          <div key={id} className="playerName">
            {name}
            {lobbyState.role === GameRole.HOST && (
              <button className="kickButton" onClick={() => kick({ playerId: id, block: false })}>
                Kick
              </button>
            )
            }
          </div>
        </div>
      ))}
    </div>
  );
}
