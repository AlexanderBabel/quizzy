import background from "../../images/blob-scene-haikei.svg";
import SocketHandler from "../../components/SocketHandler/SocketHandler";
import { useNavigate } from "react-router-dom";

export default function SocketTester() {
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

  if (process.env.NODE_ENV !== "development") {
    navigate("/");
    return;
  }

  return (
    <div className="startPage" style={svgStyle}>
      <div className="startPageTop">
        <h2 style={{ textAlign: "center", color: "white" }}>Socket Tester</h2>
      </div>
      <SocketHandler />
    </div>
  );
}
