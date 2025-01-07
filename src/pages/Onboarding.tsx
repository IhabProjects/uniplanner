import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { UserProfile } from '../types/user';
import { auth } from '../config/firebase';
import { saveUserData } from '../services/firebase';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { NotionLayout } from '../components/NotionLayout';
import { useAuth } from '../contexts/AuthContext';

const yearLevels = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];
const majors = [
  'Computer Science',
  'Engineering',
  'Business',
  'Arts',
  'Sciences',
  'Other'
];

const activityTypes = ['Club', 'Sport', 'Study Group', 'Work', 'Other'] as const;

// Validation schemas
const courseSchema = z.object({
  name: z.string().min(1, 'Course name is required'),
  code: z.string().min(1, 'Course code is required'),
  professor: z.string().optional(),
  location: z.string().optional(),
  schedule: z.array(z.object({
    day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format')
  }))
});

const activitySchema = z.object({
  name: z.string().min(1, 'Activity name is required'),
  type: z.enum(['Club', 'Sport', 'Study Group', 'Work', 'Other']),
  location: z.string().optional(),
  schedule: z.array(z.object({
    day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format')
  }))
});

const OnboardingStep1 = ({ onNext, userData }: any) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      yearLevel: userData.yearLevel || '',
      major: userData.major || '',
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Tell us about yourself</h2>
      <form onSubmit={handleSubmit(onNext)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Year Level
          </label>
          <select
            {...register('yearLevel', { required: 'Year level is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select your year</option>
            {yearLevels.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {errors.yearLevel && (
            <p className="mt-1 text-sm text-red-600">{errors.yearLevel.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Major
          </label>
          <select
            {...register('major', { required: 'Major is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select your major</option>
            {majors.map(major => (
              <option key={major} value={major}>{major}</option>
            ))}
          </select>
          {errors.major && (
            <p className="mt-1 text-sm text-red-600">{errors.major.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Next
        </button>
      </form>
    </motion.div>
  );
};

const OnboardingStep2 = ({ onNext, onBack, userData }: any) => {
  const { register, control, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courses: userData.courses || [{
        name: '',
        code: '',
        professor: '',
        location: '',
        schedule: []
      }]
    }
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "courses"
  });

  // Add schedule selection
  const CourseSchedule = ({ index }: { index: number }) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const watchSchedule = watch(`courses.${index}.schedule`);

    return (
      <div className="mt-4 space-y-2">
        <label className="block text-sm font-medium text-notion-text">Schedule</label>
        {days.map((day) => (
          <div key={day} className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register(`courses.${index}.schedule.${day}.enabled`)}
                className="form-checkbox text-notion-primary"
              />
              <span className="ml-2 text-sm text-notion-text">{day}</span>
            </label>
            {watch(`courses.${index}.schedule.${day}.enabled`) && (
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  {...register(`courses.${index}.schedule.${day}.startTime`)}
                  className="form-input text-sm"
                />
                <span className="text-notion-light-text">to</span>
                <input
                  type="time"
                  {...register(`courses.${index}.schedule.${day}.endTime`)}
                  className="form-input text-sm"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Add your courses</h2>
      <form onSubmit={handleSubmit(onNext)} className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Course {index + 1}</h3>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Course Name
                </label>
                <input
                  type="text"
                  {...register(`courses.${index}.name` as const, {
                    required: 'Course name is required'
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.courses?.[index]?.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.courses[index]?.name?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Course Code
                </label>
                <input
                  type="text"
                  {...register(`courses.${index}.code` as const, {
                    required: 'Course code is required'
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Professor
                </label>
                <input
                  type="text"
                  {...register(`courses.${index}.professor` as const)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  {...register(`courses.${index}.location` as const)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ name: '', code: '', professor: '', location: '' })}
          className="mt-4 text-indigo-600 hover:text-indigo-800"
        >
          + Add another course
        </button>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Next
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const OnboardingStep3 = ({ onNext, onBack, userData }: any) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      activities: userData.activities || [{ name: '', type: '', location: '', schedule: [] }]
    }
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "activities"
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Add your activities</h2>
      <form onSubmit={handleSubmit(onNext)} className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Activity {index + 1}</h3>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Activity Name
                </label>
                <input
                  type="text"
                  {...register(`activities.${index}.name` as const, {
                    required: 'Activity name is required'
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g., Chess Club"
                />
                {errors.activities?.[index]?.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.activities[index]?.name?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Activity Type
                </label>
                <select
                  {...register(`activities.${index}.type` as const, {
                    required: 'Activity type is required'
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select type</option>
                  {activityTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.activities?.[index]?.type && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.activities[index]?.type?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  {...register(`activities.${index}.location` as const)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g., Student Center"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Schedule
                </label>
                <div className="mt-1 space-y-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...register(`activities.${index}.schedule.${day}` as const)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{day}</span>
                      {register(`activities.${index}.schedule.${day}`).value && (
                        <div className="flex space-x-2">
                          <input
                            type="time"
                            {...register(`activities.${index}.schedule.${day}Start` as const)}
                            className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-500">to</span>
                          <input
                            type="time"
                            {...register(`activities.${index}.schedule.${day}End` as const)}
                            className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ name: '', type: '', location: '', schedule: {} })}
          className="mt-4 text-indigo-600 hover:text-indigo-800"
        >
          + Add another activity
        </button>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Finish
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<Partial<UserProfile>>({
    uid: auth.currentUser?.uid,
    email: auth.currentUser?.email || '',
    displayName: auth.currentUser?.displayName || '',
    photoURL: auth.currentUser?.photoURL || '',
  });

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/signin', { replace: true });
    }
  }, [navigate]);

  console.log('Onboarding step:', step);
  console.log('User data:', userData);

  const handleSaveUserData = async (data: Partial<UserProfile>) => {
    try {
      await saveUserData({
        ...userData,
        ...data,
        courses: data.courses || {},
        activities: data.activities || {},
      });
      toast.success('Profile saved successfully!');
      navigate('/app/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
    }
  };

  const handleNext = (data: Partial<UserProfile>) => {
    setUserData(prev => ({ ...prev, ...data }));
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSaveUserData(data);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {step === 1 && <OnboardingStep1 onNext={handleNext} userData={userData} />}
          {step === 2 && <OnboardingStep2 onNext={handleNext} onBack={handleBack} userData={userData} />}
          {step === 3 && <OnboardingStep3 onNext={handleNext} onBack={handleBack} userData={userData} />}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
