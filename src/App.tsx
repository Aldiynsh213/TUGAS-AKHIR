import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import MahasiswaPage from './pages/MahasiswaPage';
import SearchPage from './pages/SearchPage';
import SortPage from './pages/SortPage';
import AnalysisPage from './pages/AnalysisPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/mahasiswa" element={<MahasiswaPage />} />
        <Route path="/pencarian" element={<SearchPage />} />
        <Route path="/pengurutan" element={<SortPage />} />
        <Route path="/analisis" element={<AnalysisPage />} />
        <Route path="/tentang" element={<AboutPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
