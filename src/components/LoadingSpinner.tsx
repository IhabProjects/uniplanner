import { motion } from 'framer-motion';

export const LoadingSpinner = () => {
  console.log('LoadingSpinner rendering'); // Debug log
  return (
    <div className="min-h-screen flex items-center justify-center bg-notion-background">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-notion-border border-t-notion-primary rounded-full"
      />
      <div className="ml-4 text-notion-text">Loading...</div>
    </div>
  );
};
