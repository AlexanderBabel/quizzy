import background from '../../images/blob-scene-haikei.svg'
import './SocketTester.css'
import SocketHandler from '../../components/SocketHandler/SocketHandler';
import { useNavigate } from 'react-router-dom';


function SocketTester() {
  const navigate = useNavigate();
  const svgStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
  };

  if (process.env.NODE_ENV !== 'development') {
    navigate('/');
    return;
  }

  return (
    <div className='startpage' style={svgStyle}>
      <div className='startpageTop'>
        <h2 style={{ textAlign: 'center', color: 'white' }}>Socket Tester</h2>
      </div>
      <SocketHandler />
    </div>
  );
}

export default SocketTester;
