import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} /> */}
    </Routes>
  )
}

export default App