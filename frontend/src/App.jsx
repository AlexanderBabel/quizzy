import {
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import StartPage from "./pages/StartPage/StartPage";
import CreateQuizPage from "./pages/CreateQuizPage/CreateQuizPage";
import AnswerQuizPage from "./pages/AnswerQuizPage/AnswerQuizPage";
import LobbyPage from "./pages/LobbyPage/LobbyPage";
import PostLobbyPage from "./pages/PostGameLobbyPage/PostLobbyPage";
import SearchQuizPage from "./pages/SearchQuizPage/SearchQuizPage";
import QuestionStats from "./pages/QuestionStats/QuestionStats";
import SocketTester from "./pages/SocketTester/SocketTester";

function Root() {
  return (
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
  );
}

const router = createBrowserRouter([{ path: "*", Component: Root }]);

export default function App() {
  return <RouterProvider router={router} />;
}
