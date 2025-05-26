import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import ProfilePage from './pages/Profile';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import RequiresAuth from './components/Auth';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/profile"
        element={
          <RequiresAuth>
            <ProfilePage />
          </RequiresAuth>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignupPage />} />
    </Routes>
  );
}

export default App;
