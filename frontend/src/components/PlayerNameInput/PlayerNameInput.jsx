import React, { useState } from "react";
import "./PlayerNameInput.css";

export default function PlayerNameInput({ onSubmitted }) {
  const [playerName, setPlayerName] = useState("");

  return (
    <div className="playerNameField">
      <input
        className="playerNameInput"
        placeholder="Enter Name..."
        value={playerName} // Controlled input value
        onChange={(event) => setPlayerName(event.target.value)}
        onKeyUp={(event) => {
          if (event.key !== "Enter" || playerName === "") {
            return;
          }

          onSubmitted(playerName);
          setPlayerName("");
        }}
      />
      <button
        type="submit"
        className="joinButton"
        onClick={() => {
          if (playerName === "") {
            return;
          }

          onSubmitted(playerName);
          setPlayerName("");
        }}
      >
        Join
      </button>
    </div>
  );
}
