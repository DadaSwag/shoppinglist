import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ShoppingListOverview from './ShoppingListOverview';
import ShoppingListDetail from './ShoppingListDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShoppingListOverview />} />

        <Route path="/list/:listId" element={<ShoppingListDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;