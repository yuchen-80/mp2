import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import { MoviesProvider } from './context/MoviesContext'
import DetailPage from './pages/DetailPage'
import GalleryPage from './pages/GalleryPage'
import ListPage from './pages/ListPage'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <MoviesProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/movie/:id" element={<DetailPage />} />
        </Routes>
      </MoviesProvider>
    </BrowserRouter>
  )
}

export default App
