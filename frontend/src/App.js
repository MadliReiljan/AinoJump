import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/Navbar';
import { Pealeht, Meist, Broneeri, Kontakt } from './components/pages';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Pealeht />}/>
        <Route path="Pealeht" element={<Pealeht />}/>
        <Route path="Meist" element={<Meist />}/>
        <Route path="Broneeri" element={<Broneeri />}/>
        <Route path="Kontakt" element={<Kontakt />}/>
      </Routes>
    </div>
  );
}

export default App;
