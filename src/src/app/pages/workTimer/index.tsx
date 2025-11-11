import React, { useState } from 'react';
import Navbar from '@components/navbar/navbar';

const WorkTimer: React.FC = () => {
return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <h2 className="text-2xl font-bold text-white mb-15">
        Horas
      </h2>
    </div>
  );
};

export default WorkTimer;