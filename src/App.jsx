import { Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
import Explore from './pages/Explore';

const App = () => {
  return (
    <div className="min-h-screen bg-dark-900">
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </div>
  );
};

export default App;
