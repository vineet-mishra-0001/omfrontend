import React from 'react';

const CarRentalLoader = ({ message = "Loading your rental details..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6  rounded-xl h-full  w-full max-w-md mx-auto">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" className="w-full h-auto">
        {/* Background */}
        <rect width="400" height="200" fill="#f8fafc" rx="10" ry="10" />
        
        {/* Road */}
        <rect x="0" y="130" width="400" height="40" fill="#94a3b8" />
        
        {/* Road markings */}
        <g>
          <rect x="20" y="148" width="40" height="4" fill="white">
            <animate attributeName="x" from="-40" to="400" dur="2s" repeatCount="indefinite" />
          </rect>
          <rect x="100" y="148" width="40" height="4" fill="white">
            <animate attributeName="x" from="40" to="480" dur="2s" repeatCount="indefinite" />
          </rect>
          <rect x="180" y="148" width="40" height="4" fill="white">
            <animate attributeName="x" from="120" to="560" dur="2s" repeatCount="indefinite" />
          </rect>
          <rect x="260" y="148" width="40" height="4" fill="white">
            <animate attributeName="x" from="200" to="640" dur="2s" repeatCount="indefinite" />
          </rect>
          <rect x="340" y="148" width="40" height="4" fill="white">
            <animate attributeName="x" from="280" to="720" dur="2s" repeatCount="indefinite" />
          </rect>
        </g>
        
        {/* Car body */}
        <g>
          <rect x="150" y="110" width="100" height="20" fill="#3b82f6" rx="5" ry="5">
            <animate attributeName="x" values="150;155;150;145;150" dur="0.5s" repeatCount="indefinite" />
          </rect>
          
          {/* Car top */}
          <rect x="170" y="90" width="60" height="20" fill="#3b82f6" rx="5" ry="5">
            <animate attributeName="x" values="170;175;170;165;170" dur="0.5s" repeatCount="indefinite" />
          </rect>
          
          {/* Windows */}
          <rect x="175" y="95" width="20" height="10" fill="#bfdbfe" rx="2" ry="2">
            <animate attributeName="x" values="175;180;175;170;175" dur="0.5s" repeatCount="indefinite" />
          </rect>
          <rect x="205" y="95" width="20" height="10" fill="#bfdbfe" rx="2" ry="2">
            <animate attributeName="x" values="205;210;205;200;205" dur="0.5s" repeatCount="indefinite" />
          </rect>
          
          {/* Wheels */}
          <circle cx="170" cy="130" r="10" fill="#1e293b">
            <animate attributeName="cx" values="170;175;170;165;170" dur="0.5s" repeatCount="indefinite" />
            <animate attributeName="r" values="10;9;10;9;10" dur="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="230" cy="130" r="10" fill="#1e293b">
            <animate attributeName="cx" values="230;235;230;225;230" dur="0.5s" repeatCount="indefinite" />
            <animate attributeName="r" values="10;9;10;9;10" dur="0.5s" repeatCount="indefinite" />
          </circle>
          
          {/* Wheel caps */}
          <circle cx="170" cy="130" r="4" fill="#e2e8f0">
            <animate attributeName="cx" values="170;175;170;165;170" dur="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="230" cy="130" r="4" fill="#e2e8f0">
            <animate attributeName="cx" values="230;235;230;225;230" dur="0.5s" repeatCount="indefinite" />
          </circle>
        </g>
        
        {/* Headlights and taillights */}
        <rect x="150" y="115" width="5" height="5" fill="#ef4444" rx="1" ry="1">
          <animate attributeName="x" values="150;155;150;145;150" dur="0.5s" repeatCount="indefinite" />
        </rect>
        <rect x="245" y="115" width="5" height="5" fill="#fbbf24" rx="1" ry="1">
          <animate attributeName="x" values="245;250;245;240;245" dur="0.5s" repeatCount="indefinite" />
        </rect>
        
        
        
        {/* Clouds */}
        <g fill="#e2e8f0">
          <ellipse cx="50" cy="50" rx="20" ry="12">
            <animate attributeName="cx" from="400" to="-50" dur="15s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="160" cy="30" rx="25" ry="15">
            <animate attributeName="cx" from="460" to="-60" dur="20s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="280" cy="60" rx="30" ry="18">
            <animate attributeName="cx" from="500" to="-100" dur="25s" repeatCount="indefinite" />
          </ellipse>
        </g>
      </svg>
      
      <p className="mt-4 text-gray-600 text-center font-medium">{message}</p>
    </div>
  );
};

export default CarRentalLoader;