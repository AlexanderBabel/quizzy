import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import StartPage from "./pages/StartPage/StartPage";
import CreateQuizPage from "./pages/CreateQuizPage/CreateQuizPage";
import AnswerQuizPage from "./pages/AnswerQuizPage/AnswerQuizPage";
import LobbyPage from "./pages/LobbyPage/LobbyPage";
import { TokenProvider } from "./context/useToken";
import PostLobbyPage from "./pages/PostGameLobbyPage/PostLobbyPage";
import SearchQuizPage from "./pages/SearchQuizPage/SearchQuizPage";
import SocketTester from "./pages/SocketTester/SocketTester";
import { SocketProvider } from "./context/useAuthenticatedSocket";
import { LobbyProvider } from "./context/useLobby";

export default function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <TokenProvider>
        <SocketProvider>
          <LobbyProvider>
            <Router>
              <Routes>
                <Route exact path="/" element={<StartPage />} />
                <Route path="/search" element={<SearchQuizPage />} />
                <Route path="/create" element={<CreateQuizPage />} />
                <Route path="/AnswerQuiz" element={<AnswerQuizPage />} />
                <Route path="/join/:lobbyCode?" element={<LobbyPage />} />
                <Route path="/PostLobbyPage" element={<PostLobbyPage />} />
                <Route path="/tester" element={<SocketTester />} />
              </Routes>
            </Router>
          </LobbyProvider>
        </SocketProvider>
      </TokenProvider>
    </SnackbarProvider>
  );
}
