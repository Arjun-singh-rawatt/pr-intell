import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell.jsx';
import FeedPage from './pages/FeedPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import SavedPage from './pages/SavedPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<FeedPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="saved" element={<SavedPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
