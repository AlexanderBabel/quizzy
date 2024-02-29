import { MdReport } from "react-icons/md";
import './ReportQuizBtn.css'

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
      {" "}
      <h1 id="reportButtonText">Report Quiz</h1>
      <MdReport size={iconSize()} id="reportIcon"/>
    </div>
  );
}


export default ReportQuizBtn