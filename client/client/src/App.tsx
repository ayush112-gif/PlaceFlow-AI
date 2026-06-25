import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Overview from "./pages/Overview";
import Integrations from "./pages/Integrations";
import NoticeAnalyzer from "./pages/NoticeAnalyzer";
import Templates from "./pages/Templates";
import EmailLogs from "./pages/EmailLogs";
import Students from "./pages/Students";

import ProtectedRoute from "./components/ProtectedRoute";
import Drafts from "./pages/Drafts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          }
        /><Route
  path="/drafts"
  element={
    <ProtectedRoute>
      <Drafts />
    </ProtectedRoute>
  }
/>    <Route
  path="/students"
  element={<Students />}
/> <Route
  path="/templates"
  element={
    <ProtectedRoute>
      <Templates />
    </ProtectedRoute>
  }
/> <Route
  path="/logs"
  element={<EmailLogs />}
/>

        <Route
  path="/notice-analyzer"
  element={
    <ProtectedRoute>
      <NoticeAnalyzer />
    </ProtectedRoute>
  }
/>
        <Route
          path="/integrations"
          element={
            <ProtectedRoute>
              <Integrations />
            </ProtectedRoute>
          }
        />
      </Routes>
     
    </BrowserRouter>
  );
}

export default App;