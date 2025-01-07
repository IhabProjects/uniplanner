import { db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { UserProfile } from '../types/user';
import { auth } from '../config/firebase';

export const saveUserData = async (userData: Partial<UserProfile>) => {
  if (!userData.uid) throw new Error('User ID is required');
  console.log('Saving user data:', userData);

  try {
    await setDoc(doc(db, 'users', userData.uid), {
      ...userData,
      updatedAt: new Date().toISOString(),
    });
    console.log('User data saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

export const getUserData = async (uid: string): Promise<UserProfile | null> => {
  console.log('Fetching user data for UID:', uid);
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      console.log('User data found:', userDoc.data());
      return userDoc.data() as UserProfile;
    }
    console.log('No user data found');
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await auth.signOut();
    // Clear any local storage or session storage if you're using it
    localStorage.clear();
    sessionStorage.clear();
    // Force reload the page to clear any cached states
    window.location.reload();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};
