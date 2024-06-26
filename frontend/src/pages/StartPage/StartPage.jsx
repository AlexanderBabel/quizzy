import { useNavigate } from "react-router-dom";
import "./StartPage.css";
import background from "../../images/blob-scene-haikei.svg";
import CardStartPage from "../../components/Card/CardStartPage";
import LoginBtn from "../../components/Buttons/LoginBtn";
import MyQuizzes from "../../components/MyQuizzes/MyQuizzes";
import useToken from "../../context/useToken";
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Startpage() {

  const phoneScreenSize = useMediaQuery('(max-width:1000px)');

  const { isCreator } = useToken();
  const navigate = useNavigate();

  const svgStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "100vw",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
    overflow: "hidden",
  };

  return (
   phoneScreenSize ? 
   <div className="startPage" style={svgStyle}>
      <div className="cardContainer">
        <CardStartPage text={"Join a quiz!"} inputBool={true} />
      </div>
    </div>
   :
    <div className="startPage" style={svgStyle}>
      <div className="startPageTop">
        <LoginBtn />
      </div>
      <div className="cardContainer">

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
