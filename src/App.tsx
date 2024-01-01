import ChatPage from "./Pages/ChatPage";
import Layout from "./Pages/Layout";
import ListPage from "./Pages/ListPage";
import LoginPage from "./Pages/LoginPage"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProfilePage from "./Pages/ProfilePage";

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<LoginPage />} />         
        <Route path="/dashboard" element={<Layout />} >
          <Route index element={<ListPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>      
    </BrowserRouter>
  );
}

export default App;
