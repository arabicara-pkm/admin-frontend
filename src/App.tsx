import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "../src/contexts/AuthContext";
import { ProtectedRoute } from "../src/components/ProtectedRoute";
import { LoginPage } from "../src/pages/LoginPage";
import { AdminLayout } from "../src/layouts/AdminLayout";
import { DashboardPage } from "../src/pages/DashboardPage";
import { VocabularyPage } from "./pages/VocabularyPage";
import { LevelsPage } from "./pages/LevelsPage";
import { LessonsPage } from "./pages/LessonsPage";
import { CategoryPage } from "./pages/CategoryPage";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="vocabulary" element={<VocabularyPage />} />
            <Route path="categories" element={<CategoryPage />} />
            <Route path="levels" element={<LevelsPage />} />
            <Route
              path="levels/:levelId/lessons"
              element={<LessonsPage />}
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
