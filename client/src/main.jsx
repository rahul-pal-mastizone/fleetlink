import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Index from './pages/Index.jsx'
import AddVehicle from './pages/AddVehicle.jsx'
import SearchBook from './pages/SearchBook.jsx'
import NotFound from './pages/NotFound.jsx'
import Status from './pages/Status.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/add-vehicle" element={<AddVehicle />} />
        <Route path="/search-book" element={<SearchBook />} />
        <Route path="/status" element={<Status />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
