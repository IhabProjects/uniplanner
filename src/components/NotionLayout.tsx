import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';

interface NotionLayoutProps {
  children: ReactNode;
}

export const NotionLayout = ({ children }: NotionLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === `/app/${path}`;

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white font-notion">
      <div className="flex">
        <motion.div
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          className="w-60 h-screen fixed bg-notion-sidebar border-r border-notion-border"
        >
          <div className="p-4">
            <h1 className="text-xl font-semibold text-notion-text">UniPlanner</h1>
          </div>
          <nav className="mt-6">
            {[
              { path: 'dashboard', label: 'Dashboard' },
              { path: 'schedule', label: 'Schedule' },
              { path: 'friends', label: 'Friends' },
              { path: 'groups', label: 'Groups' },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={`/app/${path}`}
                className={`block px-4 py-2 text-sm ${
                  isActive(path)
                    ? 'bg-notion-hover text-notion-text font-medium'
                    : 'text-notion-light-text hover:bg-notion-hover'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-sm text-notion-light-text hover:bg-notion-hover rounded"
            >
              Sign Out
            </button>
          </div>
        </motion.div>
        <div className="flex-1 ml-60">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
