import background from '../../images/blob-scene-haikei-8.svg';
import PlayerScore from '../../components/PlayerScore/PlayerScore';
import './QuestionStats.css';
import ChosenAnswers from '../../components/ChosenAnswers/ChosenAnswers';
import useGame from '../../context/useGame';
import useLobby, { GameRole } from '../../context/useLobby';
import { useSocketEvent } from 'socket.io-react-hook';
import useAuthenticatedSocket from '../../context/useAuthenticatedSocket';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiSmileySad, PiSmiley } from 'react-icons/pi';
import { IoIosFlash } from 'react-icons/io';

export default function QuestionStats() {
  const { lobbyState } = useLobby();
  const { gameState } = useGame();
  const navigate = useNavigate();
  const { socket } = useAuthenticatedSocket();
  const { sendMessage: nextQuestion } = useSocketEvent(
    socket,
    'game:nextQuestion'
  );

  const svgStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    width: '100%',
    height: '100%',
    minHeight: '100vh',
    margin: 0,
    padding: 0,
  };

  useEffect(() => {
    if (gameState.question && !gameState.results) {
      navigate('/game');
    }
  }, [gameState.question, gameState.results]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='questionStatsPage' style={svgStyle}>
      <div className='questionStatsTop'>
        <h1>{gameState?.question?.question}</h1>
        {lobbyState?.role === GameRole.HOST && (
          <button
            className='nextBtn'
            onClick={() => {
              if (gameState?.results.gameOver) {
                navigate('/game/results');
                return;
              }

              nextQuestion();
            }}
          >
            Next
          </button>
        )}
      </div>

      {lobbyState?.role === GameRole.HOST && (
        <div className='questionStatsFigures'>
          <div className='playerStatsSection'>
            {gameState?.results?.scores?.map(({ name, score }) => (
              <PlayerScore playerName={name} playerScore={score} />
            ))}
          </div>
          <div>
            <ChosenAnswers />
          </div>
        </div>
      )}
      {lobbyState?.role === GameRole.PLAYER && (
        // TODO: implement player view
        <div id='playerQuestionStatDiv'>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <div id='playerScore'>
              <p>Score: {gameState?.results?.score}</p>
            </div>
            <div id='gainedThisRound'>
              <IoIosFlash size={'20px'} />
              <p>Gained this round: {gameState?.results?.delta}</p>
            </div>
          </div>

          <div>
            {gameState?.results?.correct ? (
              <PiSmiley size={'150px'} style={{ color: 'green' }} />
            ) : (
              <PiSmileySad size={'150px'} style={{ color: 'red' }} />
            )}

            <h1
              style={
                gameState?.results?.correct
                  ? { color: 'green' }
                  : { color: 'red' }
              }
            >
              {gameState?.results?.correct
                ? 'Correct Answer!'
                : 'Incorrect Answer'}
            </h1>
            {/* <h2>Place: {gameState?.results?.place}</h2> */}
          </div>

          <p>Waiting for host to continue...</p>
        </div>
      )}
    </div>
  );
}
