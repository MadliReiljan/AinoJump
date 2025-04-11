import { Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AboutUs, MainPage, Info, Calendar } from './components/pages';
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
        <Route path="Info" element={<Info />}/>
        <Route path="Login" element={<LoginPage/>}/>
        <Route path="Register" element={<Register/>}/>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
