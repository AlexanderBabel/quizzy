
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Startpage from "./pages/Startpage/Startpage";
import CreateQuizPage from "./pages/CreateQuiz/CreateQuizPage";
import AnswerQuizPage from "./pages/AnswerQuiz/AnswerQuizPage";
import LobbyPage from "./pages/GameLobby/LobbyPage";
import useToken from "./components/useToken/useToken";
import SearchQuiz from "./pages/SearchQuiz/SearchQuiz";
import SocketTester from "./pages/SocketTester/SocketTester";


function App() {
  const { token, isGuest, setToken } = useToken();

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Startpage token={token} isGuest={isGuest} setToken={setToken} />} />
        <Route path="/CreateQuiz" element={<CreateQuizPage />} />
        <Route path="/SearchQuiz" element={<SearchQuiz token={token} setToken={setToken} />} />

        <Route path="/AnswerQuiz" element={<AnswerQuizPage />} />
        <Route path="/LobbyPage" element={<LobbyPage />} />
        <Route path="/SocketTester" element={<SocketTester />} />
      </Routes>
    </Router>
  );
}

export default App;
