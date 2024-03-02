import './WaitingPage.css';

export default function WaitingPage({ text }) {
  return (
    <div className='waiting-page'>
      <div className='spinner'></div>
      <p className='loading-text'>{text}</p>
    </div>
  );
}
