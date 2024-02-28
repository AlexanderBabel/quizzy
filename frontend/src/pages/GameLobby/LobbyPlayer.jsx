import "./LobbyPage.css";
import background from "./../../images/blob-scene-haikei-2.svg";
import PlayerNameGrid from "../../components/PlayerNameGrid/PlayerNameGrid";
import UsernameTextField from "../../components/UsernameTextField/PlayerNameInput";
import StartGameBtn from "../../components/Buttons/StartGameBtn";
import PlayerCounter from "../../components/PlayerCounter/PlayerCounter";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useToken from "../../components/useToken/useToken";

import { useSocket, useSocketEvent } from "socket.io-react-hook";

function LobbyPlayer() {
  const URL =
    process.env.NODE_ENV === "production" ? undefined : "ws://127.0.0.1:3001";

  const useAuthenticatedSocket = (token) => {
    return useSocket(URL, {
      enabled: !!token,
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const { token, setToken } = useToken();
  const { socket } = useAuthenticatedSocket(token);

  const location = useLocation();
  //   const { quizId } = location.state;
  const { playerJoinLobbyId } = location.state;

  const [role, setRole] = useState("player");
  //   const [lobbyId, setLobbyId] = useState();

  //   const { lastMessage: lobbyMessage, sendMessage: sendLobbyMessage } =
  //     useSocketEvent(socket, 'lobby:create');

  const {
    lastMessage: joinLobbyMessage,
    sendMessage: sendJoinLobbyMessage,
  } = // eslint-disable-line
    useSocketEvent(socket, "lobby:join");
  const { lastMessage: players } = useSocketEvent(socket, "lobby:players");

  const [isConnected, setIsConnected] = useState(socket.connected);

  console.log(joinLobbyMessage);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }
    const currentSocket = socket;
    currentSocket.on("connect", onConnect);
    currentSocket.on("disconnect", onDisconnect);
    currentSocket.on("exception", function (data) {});

    return () => {
      currentSocket.off("connect", onConnect);
      currentSocket.off("disconnect", onDisconnect);
      currentSocket.off("exception");
      currentSocket.disconnect();
    };
  }, [socket]);

  function joinLobby(playerName) {
    if (isConnected & playerJoinLobbyId) {
      setRole("player");
      sendJoinLobbyMessage({ playerJoinLobbyId, playerName });
    }
  }

  useEffect(() => {
    joinLobby("natasha");
  }, [playerJoinLobbyId, isConnected]);

  var isCreator = true;

  var [isJoined, setJoined] = useState(false);

  let [playersJoined, setPlayersJoined] = useState([
    "Natasha",
    "Jocke",
    "Lukas",
    "Alex",
    "Fatih",
  ]);

  const svgStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "100vw",
    height: "100vh",
    margin: 0,
    padding: 0,
    overflow: "hidden",
  };

  const quizName = "Title of Quiz";

  return (
    <div className="lobbyPage" style={svgStyle}>
      <div>
        <div className="header">
          <h1 className="lobbyTitle">{quizName}</h1>
          {isCreator ? <StartGameBtn /> : null}
          <PlayerCounter playerCount={playersJoined.length}></PlayerCounter>
        </div>
        <h1 className="lobbyCodeTitle">Game Pin: {playerJoinLobbyId}</h1>
      </div>
      {/* <PlayerNameGrid players={playersJoined}></PlayerNameGrid> */}
      {isJoined ? (
        <h1 style={{ color: "white" }}>Waiting for game to start...</h1>
      ) : (
        <UsernameTextField
          className="playerNameInput"
          // onSubmitted={joinLobby}
        ></UsernameTextField>
      )}
    </div>
  );
}

export default LobbyPlayer;
