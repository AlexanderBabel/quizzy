import { MdReport } from "react-icons/md";
import "./ReportQuizBtn.css";

function ReportQuizBtn() {
  const iconSize = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 500) {
      return 13;
    } else {
      return 30;
    }
  };
  return (
    <div id="reportQuizWrapper">
      <MdReport size={iconSize()} id="reportIcon" />
      <h1 id="reportButtonText">Report Quiz</h1>
    </div>
  );
}

export default ReportQuizBtn;
