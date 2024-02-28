import "./StartGameBtn.css";
export default function StartGameBtn({ route, text }) {
  return (
    <div id="wrapper">
      <button id="startGameButton">{text}</button>
    </div>
  );
}
