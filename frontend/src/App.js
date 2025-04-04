import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/Navbar';
import { AboutUs, MainPage, Contact, Calendar } from './components/pages';
import LoginPage from './components/pages/Login';
import Register from './components/pages/Register';
import Footer from './components/footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />}/>
        <Route path="Pealeht" element={<MainPage />}/>
        <Route path="Meist" element={<AboutUs />}/>
        <Route path="Broneeri" element={<Calendar />}/>
        <Route path="Kontakt" element={<Contact />}/>
        <Route path="Login" element={<LoginPage/>}/>
        <Route path="Register" element={<Register/>}/>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
