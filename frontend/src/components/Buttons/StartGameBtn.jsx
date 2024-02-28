import "./StartGameBtn.css";

export default function StartGameBtn({ text, onClick }) {
  return (
    <div id="wrapper">
      <button id="startGameButton" onClick={onClick}>
        {text}
      </button>
    </div>
  );
}
