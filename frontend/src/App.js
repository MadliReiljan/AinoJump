import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/Navbar';
import { AboutUs, MainPage, Contact, Calendar } from './components/pages';

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
      </Routes>
    </div>
  );
}

export default App;
