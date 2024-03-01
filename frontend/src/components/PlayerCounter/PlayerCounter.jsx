import "./PlayerCounter.css";
import { FaUserAlt } from "react-icons/fa";

export default function PlayerCounter({ playerCount }) {
  return (
    <div id="wrapper">
      <div className="PlayerCounter">
        <FaUserAlt size={15} style={{ color: "white" }} />
        <p id="playerCountText">{playerCount}</p>
      </div>
    </div>
  );
}
