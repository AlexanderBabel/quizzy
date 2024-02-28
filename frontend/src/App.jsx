import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Startpage from "./pages/Startpage/Startpage";
import CreateQuizPage from "./pages/CreateQuiz/CreateQuizPage";
import AnswerQuizPage from "./pages/AnswerQuiz/AnswerQuizPage";
import LobbyPage from "./pages/GameLobby/LobbyPage";
import LobbyPlayer from "./pages/GameLobby/LobbyPlayer";
import { TokenProvider } from "./components/useToken/useToken";
import PostLobbyPage from "./pages/PostGameLobby/PostLobbyPage";
import SearchQuiz from "./pages/SearchQuiz/SearchQuiz";
import SocketTester from "./pages/SocketTester/SocketTester";
import { SocketProvider } from "./components/useAuthenticatedSocket/useAuthenticatedSocket";

export default function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <TokenProvider>
        <SocketProvider>
          <Router>
            <Routes>
              <Route exact path="/" element={<Startpage />} />
              <Route path="/SearchQuiz" element={<SearchQuiz />} />
              <Route path="/CreateQuiz" element={<CreateQuizPage />} />
              <Route path="/AnswerQuiz" element={<AnswerQuizPage />} />
              <Route path="/LobbyPage" element={<LobbyPage />} />
              <Route path="/LobbyPlayer" element={<LobbyPlayer />} />
              <Route path="/PostLobbyPage" element={<PostLobbyPage />} />
              <Route path="/SocketTester" element={<SocketTester />} />
            </Routes>
          </Router>
        </SocketProvider>
      </TokenProvider>
    </SnackbarProvider>
  );
}
