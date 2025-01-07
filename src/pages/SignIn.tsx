import { useState } from 'react';
import { auth } from '../config/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUserData } from '../services/firebase';
import LoadingSpinner from '../components/LoadingSpinner';

const SignIn = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = await getUserData(user.uid);

      if (!userData) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/app/dashboard', { replace: true });
      }
    } catch (err: any) {
      console.error("Sign-in error:", err);
      setError(`Sign-in error: ${err.message || 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-notion-background py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-notion-text">
            Welcome to UniPlanner
          </h2>
          <p className="mt-2 text-center text-sm text-notion-light-text">
            Sign in to manage your academic schedule
          </p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="mt-8">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`w-full flex justify-center items-center px-4 py-2 border border-notion-border rounded-md shadow-sm text-sm font-medium text-notion-text bg-white hover:bg-notion-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-notion-primary ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Sign in with Google
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
