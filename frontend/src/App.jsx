
import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";
import Customize from "./pages/customize";
import Home from "./pages/home";
import { userDataContext } from "./context/UserContext";
import Customize2 from "./pages/customize2";

function App() {
  const { userData } = useContext(userDataContext);

  return (
    <Routes>
      <Route path="/" element={userData?.assistantImage && userData.assistantName ? <Home /> : <Navigate to="/customize" />} />
      <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
      <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" />} />
      <Route path="/customize" element={userData ? <Customize /> : <Navigate to="/signup" />} />
            <Route path="/customize2" element={userData ? <Customize2 /> : <Navigate to="/signup" />} />
    </Routes>
  );
}

export default App