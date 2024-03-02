import React, { useState } from 'react';
import useToken from '../../components/useToken/useToken';

const ReportQuiz = ({ quizId }) => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { token, setToken } = useToken(); 

  const handleReportClick = () => {
    setShowReportForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const apiUrl = `${process.env.REACT_APP_API_ENDPOINT}/v1/quiz/${quizId}/report`;
    console.log("apiUrl", apiUrl)

    const reportData = { reason };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(reportData),
      });

      if (response.status === 400) {
        const data = await response.json();
        alert(`Error: ${data.message}`);
        return;
      }

      const data = await response.json();
      if (data.success) {
        alert('Report submitted successfully.');
        setShowReportForm(false);
        setReason('');
      } else {
        alert('Failed to submit report.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button onClick={handleReportClick}>Report</button>
      {showReportForm && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="reason">Reason:</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
          <button type="submit" disabled={isSubmitting}>
            Submit Report
          </button>
        </form>
      )}
    </div>
  );
};

export default ReportQuiz;