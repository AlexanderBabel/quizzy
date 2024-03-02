import React, { useState } from 'react';
import { MdReport } from "react-icons/md";
import useToken from "../../context/useToken";
import "./ReportQuizBtn.css";
import { enqueueSnackbar } from "notistack";
import useLobby from "../../context/useLobby";


function ReportQuizBtn({ quizId }) {
  const [showReportForm, setShowReportForm] = useState(false);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { token } = useToken();
  const { lobbyState } = useLobby();


  const handleIconClick = () => {
    setShowReportForm(!showReportForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const apiUrl = `${process.env.REACT_APP_API_ENDPOINT}/v1/quiz/${lobbyState.quizId}/report`;
    enqueueSnackbar(`Error: ${apiUrl}`, {
      variant: "error",
    });

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (response.status === 400) {
        const data = await response.json();
        enqueueSnackbar(`Error: ${data.message}`, {
          variant: "error",
        });
        return;
      }

      const data = await response.json();
      if (data.success) {
        enqueueSnackbar('Report submitted successfully.', {
          variant: "success",
        });
        setShowReportForm(false);
        setReason('');
      } else {
        alert('Failed to submit report.');
        enqueueSnackbar(`Failed to submit report`, {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar(`Error submitting report. Error: ${error}`, {
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconSize = () => {
    const screenWidth = window.innerWidth;
    return screenWidth <= 500 ? 13 : 30;
  };

  return (
    <div id="reportQuizWrapper">
      <MdReport size={iconSize()} id="reportIcon" onClick={handleIconClick} />
      <h1 id="reportButtonText" onClick={handleIconClick}>Report Quiz</h1>
      {showReportForm && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="reason">Reason for Reporting:</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
          <button type="submit" disabled={isSubmitting}>Submit Report</button>
        </form>
      )}
    </div>
  );
}

export default ReportQuizBtn;

