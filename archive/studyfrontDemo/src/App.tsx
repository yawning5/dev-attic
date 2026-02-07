import axios from "axios";

const token = localStorage.getItem("accessToken");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BoardListPage from './pages/BoardListPage';
import BoardDetailPage from './pages/BoardDetailPage';
import BoardWritePage from "./pages/BoardWritePage";
import LoginPage from "./pages/LoginPage";
import BoardEditPage from "./pages/BoardEditPage";
import MyPage from "./pages/MyPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/board/write" element={<BoardWritePage />} />
                <Route path="/board/:id/edit" element={<BoardEditPage />} />
                <Route path="/board/:id" element={<BoardDetailPage />} />
                <Route path="/boards" element={<BoardListPage />} />
                <Route path="/member/my" element={<MyPage />} />
            </Routes>
        </Router>
    );
}
export default App;