
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Startpage from "./pages/Startpage/Startpage";
import CreateQuizPage from "./pages/CreateQuiz/CreateQuizPage";
import AnswerQuizPage from "./pages/AnswerQuiz/AnswerQuizPage";
import LobbyPage from "./pages/GameLobby/LobbyPage";


function App() {
  // const isLoggedIn= true

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Startpage />} />
        <Route path="/CreateQuiz" element={<CreateQuizPage />} />
        <Route path="/AnswerQuiz" element={<AnswerQuizPage />} />
        <Route path="/LobbyPage" element={<LobbyPage />} />


      </Routes>
    </Router>
  );
}

export default App;
