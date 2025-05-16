// filepath: c:\Users\madli\AinoJump\frontend\src\App.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AboutUs, MainPage, Info, Calendar } from "./pages";
import LoginPage from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import User from "./pages/User";
import Footer from "./components/PageFooter";
import { AuthProvider } from "./auth/Authentication";
import PageTransition from "./components/PageTransition";
import AdminUserList from "./pages/AdminUserList";
import ScrollToTop from "./components/ScrollToTop";

function App() {
    return (
        <AuthProvider>
            <div className="App">
                <ScrollToTop />
                <Navbar />
                <PageTransition>
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="Pealeht" element={<MainPage />} />
                        <Route path="Meist" element={<AboutUs />} />
                        <Route path="Broneeri" element={<Calendar />} />
                        <Route path="Info" element={<Info />} />
                        <Route path="Login" element={<LoginPage />} />
                        <Route path="Register" element={<Register />} />
                        <Route path="forgot_password" element={<ForgotPassword />} />
                        <Route path="reset_password" element={<ResetPassword />} />
                        <Route path="User" element={<User />} />
                        <Route path="admin_user_list" element={<AdminUserList />} />
                    </Routes>
                </PageTransition>
                <Footer />
            </div>
        </AuthProvider>
    );
}

export default App;