import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getUserData } from '../services/firebase';
import { auth } from '../config/firebase';
import { UserProfile } from '../types/user';

const Dashboard = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (auth.currentUser) {
        try {
          const data = await getUserData(auth.currentUser.uid);
          setUserData(data);
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Welcome Section */}
        <div className="bg-notion-sidebar p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-notion-text">
            Welcome back, {userData.displayName}
          </h1>
          <p className="text-notion-light-text mt-2">
            {userData.yearLevel} - {userData.major}
          </p>
        </div>

        {/* Course Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-notion-text">Your Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userData.courses?.map((course) => (
              <div key={course.id} className="bg-white p-4 rounded-lg border border-notion-border">
                <h3 className="font-medium text-notion-text">{course.name}</h3>
                <p className="text-notion-light-text text-sm">{course.code}</p>
                <p className="text-notion-light-text text-sm mt-2">
                  Professor: {course.professor}
                </p>
                <p className="text-notion-light-text text-sm">
                  Location: {course.location}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Activities Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-notion-text">Your Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userData.activities?.map((activity) => (
              <div key={activity.id} className="bg-white p-4 rounded-lg border border-notion-border">
                <h3 className="font-medium text-notion-text">{activity.name}</h3>
                <p className="text-notion-light-text text-sm">{activity.type}</p>
                <p className="text-notion-light-text text-sm mt-2">
                  Location: {activity.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
