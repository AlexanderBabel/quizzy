
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Startpage from "./pages/Startpage/Startpage";
import CreateQuizPage from "./pages/CreateQuiz/CreateQuiz";

function App() {
  const isLoggedIn= true
  


  return (
           <Router>
            <Routes>
                <Route exact path="/" element={<Startpage />} />
                <Route path="/CreateQuiz" element={<CreateQuizPage />} />
              

          </Routes>
        </Router>
   
  );
}

export default App;
