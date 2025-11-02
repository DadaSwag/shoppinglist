import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ShoppingListDetail from './ShoppingListDetail';

const HomePage = () => (
  <div style={{ padding: '20px' }}>
    <h1>Moje nákupní seznamy</h1>
    <nav>
      <Link to="/list/list-1">Zobrazit seznam 'Víkendový nákup'</Link>
    </nav>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        
        <Route path="/list/:listId" element={<ShoppingListDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;