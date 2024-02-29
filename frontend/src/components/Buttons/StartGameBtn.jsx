import "./StartGameBtn.css";

export default function StartGameBtn({ text, onClick }) {
  return (
    <div >
      <button id="startGameButton" onClick={onClick}>
        {text}
      </button>
    </div>
  );
}
