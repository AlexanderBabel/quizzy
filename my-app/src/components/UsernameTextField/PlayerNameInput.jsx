import React, { useState } from "react";
import "./PlayerNameInput.css";

function PlayerNameInput({ onSubmitted }) {
  const [playerName, setPlayerName] = useState("")

  const onChange = (event) => {
    setPlayerName(event.target.value);
  };

  const handleSubmit = () => {
    onSubmitted(playerName)
    setPlayerName("")
  }

  return (
    <div className="playerNameField">
        <input
          className="playerNameInput"
          placeholder="Enter Name..."
          value={playerName} // Controlled input value
          onChange={onChange}
        />
        <button type="submit" className="joinButton" onClick={handleSubmit}>
          Join
        </button>
    </div>
  );
}

export default PlayerNameInput;
