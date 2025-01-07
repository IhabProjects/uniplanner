import { createBrowserRouter, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { NotionLayout } from '../components/NotionLayout';
import SignIn from '../pages/SignIn';
import Onboarding from '../pages/Onboarding';
import Dashboard from '../pages/Dashboard';
import Schedule from '../pages/Schedule';
import Friends from '../pages/Friends';
import Groups from '../pages/Groups';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PublicRoute } from '../components/PublicRoute';
import { getUserData } from '../services/firebase';
import { useEffect, useState } from 'react';
import { auth } from '../services/firebase';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) {
        setCheckingOnboarding(false);
        return;
      }

      try {
        const userData = await getUserData(user.uid);
        if (!userData) {
          await auth.signOut();
          localStorage.clear();
          sessionStorage.clear();
          navigate('/signin', { replace: true });
          return;
        }
        setHasCompletedOnboarding(!!userData?.yearLevel);
      } catch (error) {
        console.error('Error checking onboarding:', error);
        await auth.signOut();
        localStorage.clear();
        sessionStorage.clear();
        navigate('/signin', { replace: true });
      } finally {
        setCheckingOnboarding(false);
      }
    };

    checkOnboarding();
  }, [user, navigate]);

  if (loading || checkingOnboarding) return <LoadingSpinner />;
  if (!user) return <Navigate to="/signin" replace />;
  if (!hasCompletedOnboarding) return <Navigate to="/onboarding" replace />;

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicRoute><SignIn /></PublicRoute>,
  },
  {
    path: '/signin',
    element: <PublicRoute><SignIn /></PublicRoute>,
  },
  {
    path: '/onboarding',
    element: <ProtectedRoute><Onboarding /></ProtectedRoute>,
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <NotionLayout>
          <Outlet />
        </NotionLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'schedule',
        element: <Schedule />,
      },
      {
        path: 'friends',
        element: <Friends />,
      },
      {
        path: 'groups',
        element: <Groups />,
      },
    ],
  },
]);
