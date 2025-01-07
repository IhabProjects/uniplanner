import React from 'react';

const Schedule = () => {
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Schedule</h1>
        <button className="btn-primary">
          Add Event
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-7 gap-4 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold">
              {day}
            </div>
          ))}
        </div>
        {/* Calendar grid will go here */}
        <div className="h-96 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">Calendar Component Coming Soon</span>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
