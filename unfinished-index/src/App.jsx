import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import Submit from './pages/Submit'
import About from './pages/About'
import NotFound from './pages/NotFound'
import DetailPage from './pages/DetailPage'
import IndexPage from './pages/IndexPage'
import Map from './pages/Map'

function App() {
  
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route path="/indexpage" element={<IndexPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/map" element={<Map />} />
          <Route path="/map/:slug" element={<Map />} />
          {/* Dynamic route for slugs */}
          <Route path="/detail/:slug" element={<DetailPage />} />
          {/* Catch-all route for unmatched paths */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
