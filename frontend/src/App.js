import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AboutUs, MainPage, Info, Calendar } from "./pages";
import LoginPage from "./pages/Login";
import Register from "./pages/Register";
import User from "./pages/User";
import Footer from "./components/PageFooter";
import { AuthProvider } from "./auth/Authentication";
import PageTransition from "./components/PageTransition";

function App() {
    return (
        <AuthProvider>
            <div className="App">
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
                        <Route path="User" element={<User />} />
                    </Routes>
                </PageTransition>
                <Footer />
            </div>
        </AuthProvider>
    );
}

export default App;