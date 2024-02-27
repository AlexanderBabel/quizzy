import "./PlayerCounter.css";
import { FaUserAlt } from "react-icons/fa";

function PlayerCounter({ playerCount }) {
  return (
    <div id="wrapper">
    <div className="PlayerCounter">
      <FaUserAlt size={20} style={{ color: 'white' }} />
      <p id="playerCountText">{playerCount}</p>
    </div>
    </div>

  );
}

export default PlayerCounter;
