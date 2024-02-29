import background from "../../images/blob-scene-haikei-8.svg";
import PlayerScore from "../../components/PlayerScore/PlayerScore";
import "./QuestionStats.css";
import ChosenAnswers from "../../components/ChosenAnswers/ChosenAnswers";

export default function QuestionStats() {
  const svgStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "100%",
    height: "100%",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
  };

  const playerAndScores = [
    { name: "natasha", score: "100" },
    { name: "natasha", score: "100" },
    { name: "natasha", score: "100" },
    { name: "natasha", score: "100" },
    { name: "natasha", score: "100" },
  ];

  const questionTitle =
    "This is a question in the quiz testing long title even longer to see how it looks?";

  return (
    <div className="questionStatsPage" style={svgStyle}>
      <div className="questionStatsTop">
        <h1>{questionTitle}</h1>
        <button className="nextBtn">Next</button>
      </div>

      <div className="questionStatsFigures">
        <div className="playerStatsSection">
          {playerAndScores.map((player) => (
            <PlayerScore playerName={player.name} playerScore={player.score} />
          ))}
        </div>
        <div>
          <ChosenAnswers />
        </div>
      </div>
    </div>
  );
}
