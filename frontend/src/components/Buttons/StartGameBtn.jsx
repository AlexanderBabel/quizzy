import "./StartGameBtn.css";

export default function StartGameBtn({ text }) {
  return (
    <div id="wrapper">
      <button id="startGameButton">{text}</button>
    </div>
  );
}
