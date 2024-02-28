import './WaitingPage.css';

const WaitingPage = () => {
  return (
    <div className="waiting-page">
      <div className="spinner"></div>
      <p className="loading-text">Waiting for other players to answer...</p>
    </div>
  );
};

export default WaitingPage;
