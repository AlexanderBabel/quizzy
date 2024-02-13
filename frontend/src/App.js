
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Startpage from "./pages/Startpage/Startpage";
import CreateQuizPage from "./pages/CreateQuiz/CreateQuizPage";
import AnswerQuizPage from "./pages/AnswerQuiz/AnswerQuizPage";

function App() {
  // const isLoggedIn= true

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Startpage />} />
        <Route path="/CreateQuiz" element={<CreateQuizPage />} />
        <Route path="/AnswerQuiz" element={<AnswerQuizPage />} />

      </Routes>
    </Router>
  );
}

export default App;
