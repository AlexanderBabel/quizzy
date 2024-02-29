import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import StartPage from "./pages/StartPage/StartPage";
import CreateQuizPage from "./pages/CreateQuizPage/CreateQuizPage";
import AnswerQuizPage from "./pages/AnswerQuizPage/AnswerQuizPage";
import LobbyPage from "./pages/LobbyPage/LobbyPage";
import { TokenProvider } from "./context/useToken";
import PostLobbyPage from "./pages/PostGameLobbyPage/PostLobbyPage";
import SearchQuizPage from "./pages/SearchQuizPage/SearchQuizPage";
import QuestionStats from "./pages/QuestionStats/QuestionStats";
import SocketTester from "./pages/SocketTester/SocketTester";
import { SocketProvider } from "./context/useAuthenticatedSocket";
import { LobbyProvider } from "./context/useLobby";
import { GameProvider } from "./context/useGame";

export default function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <TokenProvider>
        <SocketProvider>
          <LobbyProvider>
            <GameProvider>
              <Router>
                <Routes>
                  <Route exact path="/" element={<StartPage />} />
                  <Route path="/search" element={<SearchQuizPage />} />
                  <Route path="/create" element={<CreateQuizPage />} />
                  <Route path="/join/:lobbyCode?" element={<LobbyPage />} />
                  <Route path="/game" element={<AnswerQuizPage />} />
                  <Route path="/game/stats" element={<QuestionStats />} />
                  <Route path="/game/results" element={<PostLobbyPage />} />
                  <Route path="/tester" element={<SocketTester />} />
                </Routes>
              </Router>
            </GameProvider>
          </LobbyProvider>
        </SocketProvider>
      </TokenProvider>
    </SnackbarProvider>
  );
}
