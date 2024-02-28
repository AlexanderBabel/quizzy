import { MdReport } from "react-icons/md";
import "./ReportQuizBtn.css";

function ReportQuizBtn() {
  return (
    <div id="reportQuizWrapper">
      {" "}
      <h1 id="reportButtonText">Report Quiz</h1>
      <MdReport size={30} id="reportIcon" />
    </div>
  );
}

export default ReportQuizBtn;
