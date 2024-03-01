import { useNavigate } from "react-router-dom";
import "./StartPage.css";
import background from "../../images/blob-scene-haikei.svg";
import CardStartPage from "../../components/Card/CardStartPage";
import LoginBtn from "../../components/Buttons/LoginBtn";
import MyQuizzes from "../../components/MyQuizzes/MyQuizzes";
import useToken from "../../context/useToken";

export default function Startpage() {
  const { isCreator } = useToken();
  const navigate = useNavigate();

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

  return (
    <div className="startPage" style={svgStyle}>
      <div className="startPageTop">
        <LoginBtn />
      </div>
      <div className="cardContainer">
        {process.env.NODE_ENV === "development" && (
          <CardStartPage
            text={"Socket Tester"}
            onclick={() => navigate("/tester")}
          />
        )}
        <CardStartPage text={"Join a quiz!"} inputBool={true} />
        {isCreator && (
          <CardStartPage
            onclick={() => navigate("/create")}
            text={"Create quiz"}
          />
        )}
        <CardStartPage
          text={"Discover quizzes"}
          onclick={() => navigate("/search")}
        />
      </div>
      {isCreator && (
        <div className="myQuizzes">
          <MyQuizzes />
        </div>
      )}
    </div>
  );
}
