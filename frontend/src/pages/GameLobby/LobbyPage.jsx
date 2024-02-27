import "./LobbyPage.css";
import background from "./../../images/blob-scene-haikei-2.svg";
import PlayerNameGrid from "../../components/PlayerNameGrid/PlayerNameGrid";
import UsernameTextField from "../../components/UsernameTextField/PlayerNameInput";
import StartGameBtn from "../../components/Buttons/StartGameBtn";
import PlayerCounter from "../../components/PlayerCounter/PlayerCounter";
import { useState } from "react";

function LobbyPage() {
  const isHost = true;

  const [isJoined, setJoined] = useState(false);
  const [playersJoined, setPlayersJoined] = useState([
    "Natasha",
    "Jocke",
    "Lukas",
    "Alex",
    "Fatih",
  ]);

  function joinLobby(playerName) {
    setPlayersJoined([...playersJoined, playerName]);
    setJoined(true);
  }

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
  const lobbyCode = "123523";

  return (
    <div className="lobbyPage" style={svgStyle}>
      <div>
        <div className="header">
          <h1 className="lobbyTitle">{quizName}</h1>
          {isHost ? <StartGameBtn /> : null}
          <PlayerCounter playerCount={playersJoined.length}></PlayerCounter>
        </div>
        <h1 className="lobbyCodeTitle">Game Pin: {lobbyCode}</h1>
      </div>
      <PlayerNameGrid players={playersJoined}></PlayerNameGrid>
      {isJoined ? (
        <h1 style={{ color: "white" }}>Waiting for game to start...</h1>
      ) : (
        <UsernameTextField
          className="playerNameInput"
          onSubmitted={joinLobby}
        ></UsernameTextField>
      )}
    </div>
  );
}

export default LobbyPage;
