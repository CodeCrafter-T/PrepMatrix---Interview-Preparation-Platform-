import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import SignUpPage from "./pages/auth/SignupPage";      
import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/dashboard/HomePage" ;
import MyExperiencesPage from "./pages/dashboard/MyExperiencesPage";
import MyPreparationsPage from "./pages/dashboard/MyPreparationsPage";  
import CreateExperiencePage from "./pages/form/CreateExperiencePage";
import CreatePreparationPage from "./pages/form/CreatePreparationPage";
import SeniorsExperiencesPage from "./pages/cards/SeniorsExperiencesPage";
import AIReviewPage from "./pages/cards/AIReviewPage";
import ExperiencePage from "./pages/cards/ExperiencePage";
import UpdateExperiencePage from "./pages/cards/UpdateExperiencePage";
import ChangeThemePage from "./pages/cards/ChangeThemePage";
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
  //Theme applied to whole website
  const { theme } = useThemeStore();   
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin text-primary" />
      </div>
    );

  return (
    <div data-theme={theme}>
    <div className="relative h-full w-full">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]" />
      <Routes>
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />

        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/myexperiences" element={authUser ? <MyExperiencesPage /> : <Navigate to="/login" />} />
        <Route path="/mypreparations" element={authUser ? <MyPreparationsPage /> : <Navigate to="/login" />} />

        <Route path="/createexperience" element={authUser ? <CreateExperiencePage /> : <Navigate to="/login" />} />
        <Route path="/createpreparation" element={authUser ? <CreatePreparationPage /> : <Navigate to="/login" />} />

        <Route path="/changetheme" element={authUser ? <ChangeThemePage /> : <Navigate to="/login" />} />
        <Route path="/mypreparations/experiences" element={authUser ? <SeniorsExperiencesPage /> : <Navigate to="/login" />} />
        <Route path="/mypreparations/aireview/:id" element={authUser ? <AIReviewPage /> : <Navigate to="/login" />} />
        <Route path="/experience/:id" element={authUser ? <ExperiencePage/> : <Navigate to="/login" /> } />
        <Route path="/updateexperience/:id" element={authUser ? <UpdateExperiencePage/> : <Navigate to="/login" />} />
      </Routes>
    </div>
    <Toaster />
    </div>
  );
};
export default App;
