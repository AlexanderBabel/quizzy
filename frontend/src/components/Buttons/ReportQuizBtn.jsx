import React, { useState } from "react";
import { MdReport } from "react-icons/md";
import "./ReportQuizBtn.css";
import { enqueueSnackbar } from "notistack";
import useLobby from "../../context/useLobby";
import useAxios from "axios-hooks";

function ReportQuizBtn({ quizId }) {
  const [showReportForm, setShowReportForm] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { lobbyState } = useLobby();

  const [{ loading }, executePost] = useAxios(
    {
      url: `quiz/${lobbyState.quizId}/report`,
      method: "post",
    },
    { manual: true }
  );

  const handleIconClick = () => setShowReportForm(!showReportForm);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await executePost({
        data: { reason },
      });

      if (response.data.success) {
        enqueueSnackbar("Report submitted successfully.", {
          variant: "success",
        });
        setShowReportForm(false);
        setReason("");
      } else {
        enqueueSnackbar("Failed to submit report.", { variant: "error" });
      }
    } catch (err) {
      const errorMsg = err.response.data.message || err.message;
      enqueueSnackbar(`Error submitting report: ${errorMsg}`, {
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconSize = () => (window.innerWidth <= 500 ? 13 : 30);

  return (
    <div id="reportQuizWrapper">
      <MdReport size={iconSize()} id="reportIcon" onClick={handleIconClick} />
      <h1 id="reportButtonText" onClick={handleIconClick}>
        Report Quiz
      </h1>
      {showReportForm && (
        <form onSubmit={handleSubmit} className="form-style">
          <label htmlFor="reason">Reason for Reporting:</label>
          <textarea
            id="reason"
            className="textarea-style"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
          <button
            className="button-style"
            type="submit"
            disabled={isSubmitting || loading}
          >
            Submit Report
          </button>
        </form>
      )}
    </div>
  );
}

export default ReportQuizBtn;
