import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from './components/Layout';
import { ToastProvider } from './components/ui';
import { useStore } from './state/store';
import { HomePage } from './pages/Home';
import { OnboardingPage } from './pages/Onboarding';
import { CurriculumPage } from './pages/Curriculum';
import { ModulePage } from './pages/ModulePage';
import { LessonPage } from './pages/Lesson';
import { AssessmentPage } from './pages/Assessment';
import { PlacementPage } from './pages/Placement';
import { ProjectsPage } from './pages/Projects';
import { ProjectPage } from './pages/Project';
import { GlossaryPage } from './pages/Glossary';
import { ReviewPage } from './pages/Review';
import { AchievementsPage } from './pages/Achievements';
import { SettingsPage } from './pages/Settings';
import { LocalPage } from './pages/Local';
import { LabsPage } from './pages/Labs';
import { NotFoundPage } from './pages/NotFound';

function RequireOnboarding({ children }: { children: React.ReactElement }) {
  const onboarded = useStore((s) => s.settings.onboarded);
  const location = useLocation();
  if (!onboarded && location.pathname !== '/welcome') return <Navigate to="/welcome" replace />;
  return children;
}

export function App() {
  return (
    <ToastProvider>
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/welcome" element={<OnboardingPage />} />
            <Route
              path="/"
              element={
                <RequireOnboarding>
                  <HomePage />
                </RequireOnboarding>
              }
            />
            <Route path="/curriculum" element={<RequireOnboarding><CurriculumPage /></RequireOnboarding>} />
            <Route path="/module/:moduleId" element={<RequireOnboarding><ModulePage /></RequireOnboarding>} />
            <Route path="/lesson/:lessonId" element={<RequireOnboarding><LessonPage /></RequireOnboarding>} />
            <Route path="/assessment/:assessmentId" element={<RequireOnboarding><AssessmentPage /></RequireOnboarding>} />
            <Route path="/placement" element={<RequireOnboarding><PlacementPage /></RequireOnboarding>} />
            <Route path="/projects" element={<RequireOnboarding><ProjectsPage /></RequireOnboarding>} />
            <Route path="/project/:projectId" element={<RequireOnboarding><ProjectPage /></RequireOnboarding>} />
            <Route path="/glossary" element={<RequireOnboarding><GlossaryPage /></RequireOnboarding>} />
            <Route path="/review" element={<RequireOnboarding><ReviewPage /></RequireOnboarding>} />
            <Route path="/achievements" element={<RequireOnboarding><AchievementsPage /></RequireOnboarding>} />
            <Route path="/settings" element={<RequireOnboarding><SettingsPage /></RequireOnboarding>} />
            <Route path="/local" element={<RequireOnboarding><LocalPage /></RequireOnboarding>} />
            <Route path="/labs" element={<RequireOnboarding><LabsPage /></RequireOnboarding>} />
            <Route path="/labs/:labId" element={<RequireOnboarding><LabsPage /></RequireOnboarding>} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </ToastProvider>
  );
}
