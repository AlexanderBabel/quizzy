import "./ChosenAnswers.css";
import swine from "../../images/Swine.png";
import mouse from "../../images/Mouse.png";
import frog from "../../images/Frog.png";
import sheep from "../../images/Sheep.png";
import ChosenAnswer from "../ChosenAnswer/ChosenAnswer";

export default function ChosenAnswers() {
  const counts = [4, 5, 6, 2];
  const icons = [frog, sheep, mouse, swine];

  const barColors = ["#8ABBFE", "#FFFF71", "#FB9D4A", "#56E75B"];

  return (
    <div className="chosenAnswers">
      <div>
        <div className="bars">
          {counts.map((count, i) => (
            <ChosenAnswer count={count} backgroundColor={barColors[i]} />
          ))}
        </div>
        <div className="icons">
          {icons.map((icon) => (
            <img src={icon} alt="icon" className="answerIcon" />
          ))}
        </div>
      </div>
    </div>
  );
}
