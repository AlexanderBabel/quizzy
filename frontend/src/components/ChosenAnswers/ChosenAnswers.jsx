import "./ChosenAnswers.css";
import swine from "../../images/Swine.png";
import mouse from "../../images/Mouse.png";
import frog from "../../images/Frog.png";
import sheep from "../../images/Sheep.png";
import ChosenAnswer from "../ChosenAnswer/ChosenAnswer";
import useGame from "../../context/useGame";

export default function ChosenAnswers() {
  const { gameState } = useGame();
  const icons = [frog, sheep, mouse, swine];
  const barColors = ["#8ABBFE", "purple", "#FB9D4A", "#56E75B"];

  return (
    <div className="chosenAnswers">
      <div>
        <div className="bars">
          {gameState?.results?.answerCounts?.map(({ count }, i) => (
            <ChosenAnswer
              key={i}
              count={count}
              backgroundColor={barColors[i]}
            />
          ))}
        </div>
        <div className="icons">
          {icons.map((icon, i) => (
            <div className="answerIconWrapper" style={gameState?.results?.answerCounts[i].correct ? {background:'#3BB143'} : {background:'red'}}>
            <img key={i}  src={icon} alt="icon" className="answerIcon" />
          </div>
          ))}
        </div>
      </div>
    </div>
  );
}
