import "./PlayerCounter.css";
import { FaUserAlt } from "react-icons/fa";

export default function PlayerCounter({ playerCount }) {
  return (
    <div className="PlayerCounter">
      <FaUserAlt size={20} style={{ color: "white" }} />
      <p id="playerCountText">{playerCount}</p>
    </div>
  );
}
